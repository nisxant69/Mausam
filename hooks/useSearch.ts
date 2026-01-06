import { useState, useEffect } from "react";
import { Suggestion } from "@/types/types";
import { OPENCAGE_KEY } from "@/lib/constants";
import { makeDisplayNameFromComponents, isValidSuggestion } from "@/lib/utils";

// Comprehensive Nepal locations - cities, districts, and tourist destinations with accurate coordinates
const NEPAL_LOCATIONS: Suggestion[] = [
  // Major Cities (6 decimal places for accuracy)
  { display: "Kathmandu, Bagmati, Nepal", lat: 27.701690, lng: 85.320600 },
  { display: "Pokhara, Gandaki, Nepal", lat: 28.266890, lng: 83.968510 },
  { display: "Lalitpur (Patan), Bagmati, Nepal", lat: 27.668820, lng: 85.316580 },
  { display: "Biratnagar, Koshi, Nepal", lat: 26.455050, lng: 87.270070 },
  { display: "Bharatpur, Chitwan, Nepal", lat: 27.676940, lng: 84.431760 },
  { display: "Birgunj, Madhesh, Nepal", lat: 27.010400, lng: 84.882100 },
  { display: "Dharan, Koshi, Nepal", lat: 26.812160, lng: 87.283790 },
  { display: "Butwal, Lumbini, Nepal", lat: 27.700580, lng: 83.448290 },
  { display: "Itahari, Koshi, Nepal", lat: 26.666940, lng: 87.273890 },
  { display: "Hetauda, Bagmati, Nepal", lat: 27.428720, lng: 85.032130 },
  { display: "Janakpur, Madhesh, Nepal", lat: 26.728820, lng: 85.924620 },
  { display: "Nepalgunj, Lumbini, Nepal", lat: 28.050000, lng: 81.616670 },
  { display: "Dhangadhi, Sudurpashchim, Nepal", lat: 28.693330, lng: 80.593610 },
  { display: "Bhaktapur, Bagmati, Nepal", lat: 27.671520, lng: 85.428130 },
  { display: "Kirtipur, Bagmati, Nepal", lat: 27.678570, lng: 85.277640 },
  { display: "Banepa, Bagmati, Nepal", lat: 27.630530, lng: 85.524240 },
  { display: "Damak, Koshi, Nepal", lat: 26.662220, lng: 87.699720 },
  { display: "Tulsipur, Lumbini, Nepal", lat: 28.130830, lng: 82.297220 },
  { display: "Siddharthanagar, Lumbini, Nepal", lat: 27.503060, lng: 83.450830 },
  { display: "Gorkha, Gandaki, Nepal", lat: 28.000000, lng: 84.628890 },
  { display: "Tansen, Lumbini, Nepal", lat: 27.868610, lng: 83.547500 },
  { display: "Dhulikhel, Bagmati, Nepal", lat: 27.621940, lng: 85.554720 },
  { display: "Birendranagar, Karnali, Nepal", lat: 28.600280, lng: 81.636940 },
  { display: "Damauli, Gandaki, Nepal", lat: 27.965560, lng: 84.279170 },
  { display: "Mechinagar, Koshi, Nepal", lat: 26.653890, lng: 88.015830 },
  { display: "Rajbiraj, Madhesh, Nepal", lat: 26.538890, lng: 86.750280 },
  { display: "Lahan, Madhesh, Nepal", lat: 26.720280, lng: 86.488610 },
  { display: "Gaur, Madhesh, Nepal", lat: 26.766670, lng: 85.280560 },
  { display: "Kalaiya, Madhesh, Nepal", lat: 27.036670, lng: 85.001670 },
  { display: "Malangwa, Madhesh, Nepal", lat: 26.856940, lng: 85.560560 },
  { display: "Simara, Bagmati, Nepal", lat: 27.166390, lng: 84.981390 },
  { display: "Dipayal, Sudurpashchim, Nepal", lat: 29.250830, lng: 80.938330 },
  { display: "Mahendranagar, Sudurpashchim, Nepal", lat: 28.967500, lng: 80.181110 },
  { display: "Tikapur, Sudurpashchim, Nepal", lat: 28.528610, lng: 81.123060 },
  { display: "Gulariya, Lumbini, Nepal", lat: 28.205000, lng: 81.351390 },
  { display: "Kapilvastu, Lumbini, Nepal", lat: 27.569170, lng: 83.053610 },

  // Tourist Destinations & Trekking
  { display: "Lumbini, Lumbini, Nepal", lat: 27.483330, lng: 83.276390 },
  { display: "Namche Bazaar, Koshi, Nepal", lat: 27.806350, lng: 86.714170 },
  { display: "Lukla, Koshi, Nepal", lat: 27.686880, lng: 86.728330 },
  { display: "Chitwan National Park, Bagmati, Nepal", lat: 27.524440, lng: 84.359440 },
  { display: "Nagarkot, Bagmati, Nepal", lat: 27.715280, lng: 85.520280 },
  { display: "Bandipur, Gandaki, Nepal", lat: 27.933890, lng: 84.416670 },
  { display: "Everest Base Camp, Koshi, Nepal", lat: 28.002500, lng: 86.852500 },
  { display: "Annapurna Base Camp, Gandaki, Nepal", lat: 28.530830, lng: 83.878060 },
  { display: "Tengboche, Koshi, Nepal", lat: 27.836110, lng: 86.763890 },
  { display: "Manang, Gandaki, Nepal", lat: 28.666110, lng: 84.016670 },
  { display: "Jomsom, Gandaki, Nepal", lat: 28.781670, lng: 83.731110 },
  { display: "Muktinath, Gandaki, Nepal", lat: 28.817220, lng: 83.867780 },
  { display: "Ghandruk, Gandaki, Nepal", lat: 28.384170, lng: 83.802220 },
  { display: "Langtang, Bagmati, Nepal", lat: 28.215280, lng: 85.501670 },
  { display: "Gosaikunda, Bagmati, Nepal", lat: 28.083060, lng: 85.416670 },
  { display: "Rara Lake, Karnali, Nepal", lat: 29.518330, lng: 82.088330 },
  { display: "Phewa Lake, Gandaki, Nepal", lat: 28.210000, lng: 83.955830 },
  { display: "Begnas Lake, Gandaki, Nepal", lat: 28.175560, lng: 84.097220 },
  { display: "Tilicho Lake, Gandaki, Nepal", lat: 28.683060, lng: 83.883060 },
  { display: "Panch Pokhari, Bagmati, Nepal", lat: 27.917500, lng: 85.880000 },
  { display: "Khaptad National Park, Sudurpashchim, Nepal", lat: 29.350830, lng: 81.166670 },
  { display: "Shey Phoksundo Lake, Karnali, Nepal", lat: 29.200830, lng: 82.937500 },
  { display: "Upper Mustang, Gandaki, Nepal", lat: 29.183330, lng: 83.966110 },
  { display: "Lo Manthang, Gandaki, Nepal", lat: 29.183330, lng: 83.958610 },
  { display: "Sarangkot, Gandaki, Nepal", lat: 28.244170, lng: 83.945280 },
  { display: "Poon Hill, Gandaki, Nepal", lat: 28.399720, lng: 83.788890 },
  { display: "Swayambhunath, Bagmati, Nepal", lat: 27.714680, lng: 85.290370 },
  { display: "Boudhanath, Bagmati, Nepal", lat: 27.721520, lng: 85.361930 },
  { display: "Pashupatinath, Bagmati, Nepal", lat: 27.710580, lng: 85.348680 },
  { display: "Changu Narayan, Bagmati, Nepal", lat: 27.711940, lng: 85.429440 },

  // District Headquarters & Other Towns
  { display: "Ilam, Koshi, Nepal", lat: 26.909720, lng: 87.926940 },
  { display: "Taplejung, Koshi, Nepal", lat: 27.350830, lng: 87.666670 },
  { display: "Dhankuta, Koshi, Nepal", lat: 26.985560, lng: 87.346940 },
  { display: "Okhaldhunga, Koshi, Nepal", lat: 27.316670, lng: 86.500000 },
  { display: "Solukhumbu, Koshi, Nepal", lat: 27.790000, lng: 86.663610 },
  { display: "Khotang, Koshi, Nepal", lat: 27.018330, lng: 86.851670 },
  { display: "Bhojpur, Koshi, Nepal", lat: 27.166940, lng: 87.050560 },
  { display: "Terhathum, Koshi, Nepal", lat: 27.127220, lng: 87.553610 },
  { display: "Panchthar, Koshi, Nepal", lat: 27.131670, lng: 87.796110 },
  { display: "Sankhuwasabha, Koshi, Nepal", lat: 27.360280, lng: 87.215280 },
  { display: "Udayapur, Koshi, Nepal", lat: 26.933890, lng: 86.520830 },
  { display: "Saptari, Madhesh, Nepal", lat: 26.635280, lng: 86.736940 },
  { display: "Siraha, Madhesh, Nepal", lat: 26.654170, lng: 86.208610 },
  { display: "Dhanusha, Madhesh, Nepal", lat: 26.866670, lng: 86.018330 },
  { display: "Mahottari, Madhesh, Nepal", lat: 26.921110, lng: 85.918610 },
  { display: "Sarlahi, Madhesh, Nepal", lat: 26.997500, lng: 85.560280 },
  { display: "Rautahat, Madhesh, Nepal", lat: 27.030000, lng: 85.283060 },
  { display: "Bara, Madhesh, Nepal", lat: 27.086670, lng: 85.016670 },
  { display: "Parsa, Madhesh, Nepal", lat: 27.133610, lng: 84.881670 },
  { display: "Makwanpur, Bagmati, Nepal", lat: 27.413890, lng: 85.031670 },
  { display: "Sindhuli, Bagmati, Nepal", lat: 27.249720, lng: 85.968610 },
  { display: "Ramechhap, Bagmati, Nepal", lat: 27.319720, lng: 86.088330 },
  { display: "Dolakha, Bagmati, Nepal", lat: 27.652780, lng: 86.069440 },
  { display: "Sindhupalchok, Bagmati, Nepal", lat: 27.956940, lng: 85.701390 },
  { display: "Kavrepalanchok, Bagmati, Nepal", lat: 27.553610, lng: 85.546940 },
  { display: "Nuwakot, Bagmati, Nepal", lat: 27.905000, lng: 85.163610 },
  { display: "Rasuwa, Bagmati, Nepal", lat: 28.113890, lng: 85.381110 },
  { display: "Dhading, Bagmati, Nepal", lat: 27.895560, lng: 84.932220 },
  { display: "Chitwan, Bagmati, Nepal", lat: 27.533060, lng: 84.366390 },
  { display: "Tanahun, Gandaki, Nepal", lat: 27.929720, lng: 84.248060 },
  { display: "Lamjung, Gandaki, Nepal", lat: 28.196390, lng: 84.348890 },
  { display: "Kaski, Gandaki, Nepal", lat: 28.300000, lng: 84.000000 },
  { display: "Syangja, Gandaki, Nepal", lat: 28.100000, lng: 83.866670 },
  { display: "Parbat, Gandaki, Nepal", lat: 28.366670, lng: 83.683060 },
  { display: "Baglung, Gandaki, Nepal", lat: 28.268890, lng: 83.593060 },
  { display: "Myagdi, Gandaki, Nepal", lat: 28.500000, lng: 83.583060 },
  { display: "Mustang, Gandaki, Nepal", lat: 29.013890, lng: 83.855280 },
  { display: "Nawalparasi East, Gandaki, Nepal", lat: 27.630560, lng: 84.083060 },
  { display: "Nawalparasi West, Lumbini, Nepal", lat: 27.650000, lng: 83.653060 },
  { display: "Rupandehi, Lumbini, Nepal", lat: 27.500000, lng: 83.433060 },
  { display: "Palpa, Lumbini, Nepal", lat: 27.866390, lng: 83.546670 },
  { display: "Arghakhanchi, Lumbini, Nepal", lat: 27.930000, lng: 83.150000 },
  { display: "Gulmi, Lumbini, Nepal", lat: 28.083060, lng: 83.281110 },
  { display: "Pyuthan, Lumbini, Nepal", lat: 28.096940, lng: 82.851670 },
  { display: "Rolpa, Lumbini, Nepal", lat: 28.355280, lng: 82.656940 },
  { display: "Rukum East, Lumbini, Nepal", lat: 28.583060, lng: 82.565560 },
  { display: "Dang, Lumbini, Nepal", lat: 28.115830, lng: 82.305280 },
  { display: "Banke, Lumbini, Nepal", lat: 28.060000, lng: 81.630830 },
  { display: "Bardiya, Lumbini, Nepal", lat: 28.396670, lng: 81.363330 },
  { display: "Surkhet, Karnali, Nepal", lat: 28.600000, lng: 81.633060 },
  { display: "Dailekh, Karnali, Nepal", lat: 28.848060, lng: 81.716110 },
  { display: "Jajarkot, Karnali, Nepal", lat: 28.700000, lng: 82.196940 },
  { display: "Dolpa, Karnali, Nepal", lat: 29.013060, lng: 82.866670 },
  { display: "Jumla, Karnali, Nepal", lat: 29.276390, lng: 82.181940 },
  { display: "Kalikot, Karnali, Nepal", lat: 29.133060, lng: 81.610560 },
  { display: "Mugu, Karnali, Nepal", lat: 29.523890, lng: 82.081670 },
  { display: "Humla, Karnali, Nepal", lat: 29.966670, lng: 81.850000 },
  { display: "Rukum West, Karnali, Nepal", lat: 28.630000, lng: 82.213330 },
  { display: "Salyan, Karnali, Nepal", lat: 28.376390, lng: 82.165000 },
  { display: "Kailali, Sudurpashchim, Nepal", lat: 28.546940, lng: 80.901940 },
  { display: "Kanchanpur, Sudurpashchim, Nepal", lat: 28.950000, lng: 80.200000 },
  { display: "Dadeldhura, Sudurpashchim, Nepal", lat: 29.303060, lng: 80.583060 },
  { display: "Baitadi, Sudurpashchim, Nepal", lat: 29.518610, lng: 80.413610 },
  { display: "Darchula, Sudurpashchim, Nepal", lat: 29.848610, lng: 80.546110 },
  { display: "Bajhang, Sudurpashchim, Nepal", lat: 29.533060, lng: 81.186940 },
  { display: "Bajura, Sudurpashchim, Nepal", lat: 29.450000, lng: 81.503890 },
  { display: "Achham, Sudurpashchim, Nepal", lat: 29.066940, lng: 81.251940 },
  { display: "Doti, Sudurpashchim, Nepal", lat: 29.250000, lng: 80.946940 },
];

export const useSearch = () => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.length > 1 && !selected) {
        fetchSuggestions(input);
      } else if (input.length <= 1) {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input, selected]);

  const fetchSuggestions = async (query: string) => {
    if (!OPENCAGE_KEY) return;
    setLoadingSuggestions(true);

    try {
      const lowerQuery = query.toLowerCase();

      // First: Search local Nepal locations (instant, no API call)
      const localMatches = NEPAL_LOCATIONS.filter(loc =>
        loc.display.toLowerCase().includes(lowerQuery)
      );

      // Second: Get global results from API
      const globalUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_KEY}&limit=5`;
      const globalRes = await fetch(globalUrl);
      const globalData = await globalRes.json();

      const apiSuggestions = (globalData.results || [])
        .filter(isValidSuggestion)
        .map((r: any) => ({
          display: makeDisplayNameFromComponents(r.components, r.formatted),
          lat: r.geometry.lat,
          lng: r.geometry.lng,
        }))
        .filter((g: Suggestion) => !localMatches.some(n => n.display === g.display)); // Remove duplicates

      // Nepal results first, then API results
      const combined = [...localMatches, ...apiSuggestions].slice(0, 5);
      setSuggestions(combined);
    } catch (e) {
      console.error(e);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const onChange = (val: string) => {
    setInput(val);
    setSelected(null);
  };

  const pickSuggestion = (suggestion: Suggestion) => {
    setInput(suggestion.display);
    setSelected(suggestion);
    setSuggestions([]);
  };

  return {
    input,
    suggestions,
    selected,
    loadingSuggestions,
    onChange,
    pickSuggestion,
    setSuggestions,
  };
};