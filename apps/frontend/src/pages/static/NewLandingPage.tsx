import React, { useCallback, useEffect, useRef, useState } from "react";
// import HighResGlobe from "../../components/HighResGlobe";
import PlatformUIDemoCard from "../../components/PlatformUIDemoCard";
import NewNavbar from "../../components/NewNavbar";
import Footer from "../../components/Footer";
import LineHeader from "../../components/LineHeader";
import Card, { CardStyle } from "../../components/system/Card";

const NewLandingPage: React.FC = () => {
  const size = 2 * Math.min(window.innerWidth, window.innerHeight);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const scrollOffsetThreshold = 30;

  useEffect(() => {
    if (mainContentRef.current && navbarRef.current) {
      setScrollOffset(
        mainContentRef.current.offsetTop - navbarRef.current.clientHeight * 2
      );
    }
  }, [mainContentRef, navbarRef]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    if (!scrolled && scrollPosition >= scrollOffset + scrollOffsetThreshold) {
      setScrolled(true);
    } else if (
      scrolled &&
      scrollPosition < scrollOffset - scrollOffsetThreshold
    ) {
      setScrolled(false);
    }
  }, [scrolled, scrollOffset, scrollOffsetThreshold]);

  useEffect(() => {
    setNavbarHeight(navbarRef.current?.clientHeight || 0);
  }, [navbarRef]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const color1 = `hsl(125, 100%, 50%)`;
  const color2 = `hsl(305, 100%, 50%)`;

  return (
    <div>
      <NewNavbar transparent={!scrolled} ref={navbarRef} />
      <div
        className="flex flex-col items-center justify-center bg-gray-950 w-screen h-[101vh] overflow-hidden relative goob"
        style={{
          marginTop: `-${navbarHeight}px`,
        }}
      >
        <div className="mb-[-40%]">
          {/* <HighResGlobe width={size} height={size} /> */}
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 grain"></div>
        <div
          className="absolute top-0 left-0 right-0 bottom-0 mix-blend-overlay opacity-20"
          style={{
            background: `radial-gradient(circle at 20% 20%, ${color1} 10%, ${color2} 100%)`,
          }}
        ></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-linear-to-t from-black to-transparent opacity-50"></div>

        <h2 className="w-1/2 absolute bottom-25 text-white !text-7xl font-sabon">
          Global citizens acting as one for a conscionable world.
        </h2>
        {/* <img
          src={dropDownArrow}
          alt="arrow down"
          className="w-10 absolute bottom-5 invert"
        /> */}
        {/* </div> */}
      </div>
      <div className="w-screen flex flex-col items-center" ref={mainContentRef}>
        <div className="container py-28 mx-auto flex flex-col items-center gap-y-15">
          <h2 className="text-black !text-[24pt] font-sabon">
            We do stuff, really great stuff.
          </h2>
          <div className="flex flex-col md:flex-row gap-4 max-w-[100%] justify-center">
            <PlatformUIDemoCard idx={0} size="large" />
            <PlatformUIDemoCard idx={1} size="small" />
            <PlatformUIDemoCard idx={2} size="small" />
          </div>
          <LineHeader title="Deliberate on important issues" />
          <div className="flex flex-col md:flex-row gap-4 max-w-[100%] justify-center">
            <PlatformUIDemoCard idx={2} size="small" />
            <PlatformUIDemoCard idx={2} size="large" />
            <PlatformUIDemoCard idx={0} size="small" />
          </div>
          <LineHeader title="What we've done so far" />
          <div className="flex flex-col md:flex-row gap-4 w-[100%] justify-center">
            <Card
              style={CardStyle.Grey}
              className="!p-0 overflow-hidden w-[25%] aspect-square"
            ></Card>
            <Card
              style={CardStyle.Grey}
              className="!p-0 overflow-hidden w-[25%] aspect-square"
            ></Card>
            <Card
              style={CardStyle.Grey}
              className="!p-0 overflow-hidden w-[25%] aspect-square"
            ></Card>
            <Card
              style={CardStyle.Grey}
              className="!p-0 overflow-hidden w-[25%] aspect-square"
            ></Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewLandingPage;
