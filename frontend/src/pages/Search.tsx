import { useQuery } from "react-query";

import { useSearchContext } from "../context/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import { HotelSearchResponse } from "../types/types";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
  };

  const { data: searchResults } = useQuery<HotelSearchResponse>(
    ["search-hotels", searchParams],
    () => apiClient.searchHotels(searchParams)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter By:
          </h3>
          {/* TODO FILTERS */}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {searchResults?.pagination.total} Hotels Found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          {/* TODO sort options */}
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
