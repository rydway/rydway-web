import CarCatalog from "@/components/layout/Catalog";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import Navbar from "@/components/layout/NavBar";


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <CarCatalog/>
      <Footer/>
    </>
  )
}
