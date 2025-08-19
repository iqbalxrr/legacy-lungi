import Hero from "@/components/Hero";
import PremiumCollections from "./collections/PremiumCollections";
import DiscountCollection from "./collections/DiscountCollection";
import PopularCollection from "./collections/PopularCollection";


export default function Home() {
  return (
    <div className="pt-14 md:pt-0 pb-20 md:pb-0">
     <Hero></Hero>
     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 mb-10">
      <PremiumCollections />
      <PopularCollection />
      <DiscountCollection />
     </div>
    </div>
  );
}
