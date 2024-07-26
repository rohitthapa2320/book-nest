import { useQuery } from "react-query";

import { useSearchContext } from "../context/SearchContext";
import * as apiClient from "../api-client";
import React, { useState } from "react";
import { HotelSearchResponse } from "../types/types";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import HotelFacilitiesFilter from "../components/HotelFacilitiesFilter";
import MaxPriceFilter from "../components/MaxPriceFilter";

const Search = () => {
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOptions, setSortOptions] = useState<string>("");
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOptions,
  };

  const { data: searchResults } = useQuery<HotelSearchResponse>(
    ["search-hotels", searchParams],
    () => apiClient.searchHotels(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rating = event.target.value;
    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, rating]
        : prevStars.filter((star) => star !== rating)
    );
  };

  const handleHotelTypesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const type = event.target.value;
    setSelectedTypes((prevTypes) =>
      event.target.checked
        ? [...prevTypes, type]
        : prevTypes.filter((currType) => currType !== type)
    );
  };

  const handleHotelFacilitiesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const facility = event.target.value;
    setSelectedFacilities((prevTypes) =>
      event.target.checked
        ? [...prevTypes, facility]
        : prevTypes.filter((currFacility) => currFacility !== facility)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter By:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selectedTypes={selectedTypes}
            onChange={handleHotelTypesChange}
          />
          <HotelFacilitiesFilter
            selectedFacilities={selectedFacilities}
            onChange={handleHotelFacilitiesChange}
          />
          <MaxPriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {searchResults?.pagination.total} Hotels Found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select
            value={sortOptions}
            onChange={(event) => setSortOptions(event.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="rating">Star Rating</option>
            <option value="pricePerNightAsc">
              Price Per Night (low to high)
            </option>
            <option value="pricePerNightDesc">
              Price Per Night (high to low)
            </option>
          </select>
        </div>
        {searchResults?.data.map((hotel) => (
          <SearchResultCard hotel={hotel} />
        ))}
        <div>
          <Pagination
            page={searchResults?.pagination.page || 1}
            pages={searchResults?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
