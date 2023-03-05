import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { geoApiOptions } from "api";
import { GEO_API_URL } from "api";

const Search = ({ onSearchChange }) => {

    const [search, setSearch] = useState(null);
    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
    }
    const loadOptions = (inputValue) => {

        return fetch(`${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`, geoApiOptions)
            .then(response => response.json())
            .then(response => {
                return {
                    options: response.data.map((city) => {
                        return {
                            value: `${city.latitude} ${city.longitude}`,
                            label: `${city.name}, ${city.countryCode}`,
                        }
                    })
                }
            })
            .catch(err => console.error(err));
    }

    return (
        <Box>
            <Typography>
                hello
            </Typography>
            <AsyncPaginate
                placeholder="Search for city"
                debounceTime={2000}
                value={search}
                onChange={handleOnChange}
                loadOptions={loadOptions}
                width="100%"
            />
        </Box>
    );
};

export default Search;