import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { getViteServer } from './get-vite-server';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolveClientPath, resolveDistPath } from './resolve-path';
import * as compression from 'compression';
import { join } from 'path';
import { readFileSync } from 'fs';

function validateEnv() {
  const requiredVars = [
    'DB_HOST',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.error(
      `ERR: Missing required environment variables: ${missing.join(', ')}`,
    );
    process.exit(1);
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  validateEnv();
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  //   app.enableCors();
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Alliance API')
      .setVersion('1.0')
      .addTag('alliance')
      .addBearerAuth()
      .build();

    const documentFactory = () =>
      SwaggerModule.createDocument(app, config, {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
          controllerKey.replace('Controller', '') + '_' + methodKey,
      });

    SwaggerModule.setup('openapi', app, documentFactory, {
      yamlDocumentUrl: '/openapi.yaml',
    });
  }

  const vite = await getViteServer();
  app.use(vite.middlewares);

  app.use('*all', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html
      let template = readFileSync(resolveClientPath('index.html'), 'utf-8');

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
      //    and also applies HTML transforms from Vite plugins, e.g. global
      //    preambles from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template);

      // 3. Load the server entry. ssrLoadModule automatically transforms
      //    ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const { render } = await vite.ssrLoadModule(
        resolveClientPath('src', 'entry-server.tsx'),
      );

      // 4. render the app HTML. This assumes entry-server.js's exported
      //     `render` function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const appHtml = await render(url);

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--ssr-outlet-->`, () => appHtml);

      // 6. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  await app.listen(process.env.PORT ?? 3005, '0.0.0.0');
}

void bootstrap();
