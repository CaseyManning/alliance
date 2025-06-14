/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CitySearchDto } from './city.dto';
import { City } from './city.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GeoService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async loadCountryDataFromTxt(): Promise<Record<string, string>> {
    const filePath = path.join(__dirname, 'countryInfo.txt');
    const countries: Record<string, string> = {};
    const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const lines = data.split('\n').filter((line) => !line.startsWith('#'));
    for (const line of lines) {
      const [ISO, ISO3, ISO_NUMERIC, fips, country] = line.split('\t', 5);
      countries[ISO] = country;
    }
    return countries;
  }

  async loadCityDataFromTxt(): Promise<City[]> {
    const filePath = path.join(__dirname, 'cities15000.txt');

    const countries = await this.loadCountryDataFromTxt();

    const cities: City[] = [];
    const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const lines = data.split('\n').filter((line) => !line.startsWith('#'));
    for (const line of lines) {
      const [
        geonameid,
        name,
        asciiname,
        alternatenames,
        latitude,
        longitude,
        featureClass,
        featureCode,
        countryCode,
        cc2,
        admin1,
        admin2,
        admin3,
        admin4,
        population,
        elevation,
        dem,
        timezone,
        modificationDate,
      ] = line.split('\t');

      if (!geonameid) continue;

      console.log(
        geonameid,
        name,
        countryCode,
        admin1,
        admin2,
        latitude,
        longitude,
      );
      console.log(countries[countryCode]);
      cities.push({
        id: parseInt(geonameid),
        name: name,
        countryCode: countryCode,
        admin1: admin1,
        admin2: admin2,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        countryName: countries[countryCode],
      });
    }

    for (let i = 0; i < cities.length; i += 500) {
      await this.cityRepository.save(
        cities.slice(i, Math.min(i + 500, cities.length)),
      );
    }

    return cities;
  }

  async searchCity(
    query: string,
    latitude?: number,
    longitude?: number,
  ): Promise<CitySearchDto[]> {
    const qb = this.cityRepository
      .createQueryBuilder('c')
      .where('c.name ILIKE :name', { name: `%${query}%` });

    if (latitude != null && longitude != null) {
      // Euclidean distance in degrees – good enough for “nearby” ranking
      qb.orderBy(
        '( (c.latitude  - :lat) * (c.latitude  - :lat) ' +
          '+ (c.longitude - :lon) * (c.longitude - :lon) )',
        'ASC',
      ).setParameters({ lat: latitude, lon: longitude });
    } else {
      qb.orderBy('c.name', 'ASC');
    }

    const cities = await qb.limit(10).getMany();
    return cities;
  }
}
