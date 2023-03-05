import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Search from "components/Search";
import WidgetWrapper from "components/WidgetWrapper";
import { geoApiOptions } from "api";
import { GEO_API_URL, WEATHER_API_URL, WEATHER_API_KEY } from "api";
import { useEffect } from "react";
import { Box } from "@mui/system";
import { useState } from "react";
import { useDispatch } from "react-redux";

const WeatherWidget = () => {
    const { palette } = useTheme();
    const dispatch = useDispatch();

    const [currentWeather, setCurrentWeather] = useState(null);

    // const handleOnSearchChange = (searchData) => {
    //     console.log(searchData);
    // }
    const getCurrentWeather = async () => {
        // const [lat, lon] = loadOptions("Novi Sad").value.split(" ");
        const [lat, lon] = [45.264444444, 19.831666666];

        // const currentWeatcherFetch = `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;

        // Promise.all([currentWeatcherFetch])
        // .then(async (response) => {
        //     try{
        //         const weatherResponse = await response[0].json();
        //         console.log("VREMEEEEE", weatherResponse);
        //     }
        //     catch(err){
        //         console.log(err);
        //     }
        //     // const weatherResponse = await response[0].json();

        //     // setCurrentWeather(weatherResponse);
        // })
        // .catch((err) => console.log(err));

        const response = await fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
        if (response.status != 404 && response.status != 405) {
            const data = await response.json();
            dispatch(setCurrentWeather(data));
        }
    }

    const loadOptions = (inputValue) => {

        return fetch(`${GEO_API_URL}/cities?minPopulation=200000&namePrefix=${inputValue}`, geoApiOptions)
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
    };

    useEffect(() => {
        getCurrentWeather();
    }, []);

    return (
        <WidgetWrapper>
            <FlexBetween>
                <Typography
                    color={palette.neutral.dark}
                    variant="h5"
                    fontWeight="500"
                    sx={{ mb: "1.5rem" }}
                >NOVI SAD</Typography>
            </FlexBetween>
            {/* <Search onSearchChange={handleOnSearchChange}/> */}
            <Box
                borderRadius="6px"
                boxShadow="10px -2px 20px 2px rgb(0 0 0 / 30%)"
                color={palette.neutral.dark}
                backgroundColor={palette.background.alt}
                mt="0.25rem"
                p="1rem"
            >
                <Box>
                    <Typography
                        fontWeight="500"
                    >
                        {currentWeather.weather[0].description}
                    </Typography>
                </Box>
                <FlexBetween>
                    <FlexBetween>
                        <Typography
                            typography="h1"
                            textAlign="center">
                            {Math.round(currentWeather.main.temp)}°C
                        </Typography>
                    </FlexBetween>
                    <FlexBetween>
                        <Box textAlign="center">
                            <img alt="weather" src={`assets/icons/${currentWeather.weather[0].icon}.png`}
                                boxShadow="10px -2px 20px 2px rgb(255 255 255 / 30%)" />
                        </Box>

                    </FlexBetween>
                </FlexBetween>
                <Box>
                    <Typography>Details</Typography>
                    <FlexBetween>
                        <FlexBetween>
                            <Typography>
                                Feels like
                            </Typography>
                        </FlexBetween>
                        <FlexBetween>
                            <Typography>
                                {Math.round(currentWeather.main.feels_like)}°C
                            </Typography>
                        </FlexBetween>
                    </FlexBetween>

                    <FlexBetween>
                        <FlexBetween>
                            <Typography>
                                Wind
                            </Typography>
                        </FlexBetween>
                        <FlexBetween>
                            <Typography>
                                {currentWeather.wind.speed}m/s
                            </Typography>
                        </FlexBetween>
                    </FlexBetween>

                    <FlexBetween>
                        <FlexBetween>
                            <Typography>
                                Humidity
                            </Typography>
                        </FlexBetween>
                        <FlexBetween>
                            <Typography>
                                {currentWeather.main.humidity}%
                            </Typography>
                        </FlexBetween>
                    </FlexBetween>

                    <FlexBetween>
                        <FlexBetween>
                            <Typography>
                                Pressure
                            </Typography>
                        </FlexBetween>
                        <FlexBetween>
                            <Typography>
                                {currentWeather.main.pressure}hPa
                            </Typography>
                        </FlexBetween>
                    </FlexBetween>
                </Box>
            </Box>
        </WidgetWrapper>

    )
}

export default WeatherWidget;