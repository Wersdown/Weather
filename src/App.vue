<template>
    <div class="focus-holder" ref="FocusHolder"></div>
    <div class="wrapper">
        <div class="background" ref="BackgroundBase"></div>
        <section class="classic">
            <div class="navbar">
                <div class="city" ref="SelectorBase">
                    <div class="name" @click="openCitySelector()">
                        <span>
                            {{ CityName }}
                            <div class="arrow">
                                <div class="line"></div>
                                <div class="head"></div>
                            </div>
                        </span>
                        <div class="shadow"></div>
                    </div>
                    <div class="select" ref="Selector">
                        <div class="search">
                            <div class="input">
                                <Icon icon="system-uicons:search" class="search-icon" />
                                <input type="text" placeholder="Şehir Ara..." v-model="City" @keydown="inputSendEvent">
                                <button class="add" @click="addCity()">
                                    <Icon icon="mdi:plus" />
                                </button>
                            </div>
                        </div>
                        <div class="cities">
                            <h3 class="no-city" v-if="store.state.cities.length == 0">You can add cities to favourites</h3>
                            <div class="city" v-for="city in store.state.cities" @click="City = city; renew();">
                                <h3>{{ city }}</h3>

                                <div class="control">
                                    <div class="remove"
                                        @click="store.state.cities = store.state.cities.filter((city1) => { return city != city1 })">
                                        <Icon icon="solar:trash-bin-trash-outline" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="current">
                <div class="weather">
                    <div class="icon"
                        :style="`background-image: url('/weather/${makeIcon(debugData.list[0].weather[0].icon)}.svg')`">
                    </div>
                    <div class="status">
                        <h1>{{ debugData.list[0].main.temp }}<span>°C</span></h1>
                        <span ref="CurrentDescription">{{ makeDescription(debugData.list[0].weather[0].description)
                        }}</span>
                    </div>
                </div>
                <div class="clock"><span>{{ Clock.full }}<span>{{ Clock.seconds }}</span></span></div>
            </div>
            <div class="continuous">
                <div class="top">
                    <div class="box next-hour">
                        <div class="icon"
                            :style="`background-image: url('/weather/${makeIcon(debugData.list[24 / 3].weather[0].icon)}.svg')`">
                        </div>
                        <div class="status">
                            <h1>Ertesi Gün</h1>
                            <h3>{{ debugData.list[24 / 3].main.temp }}<span>°C</span></h3>
                            <span>{{ makeDescription(debugData.list[24 / 3].weather[0].description) }}</span>
                        </div>
                    </div>
                    <div class="box details">
                        <div class="detail">
                            <Icon icon="carbon:windy" />
                            <h3>{{ debugData.list[0].wind.speed }} km/h</h3>
                        </div>
                        <div class="detail">
                            <Icon icon="carbon:pressure" />
                            <h3>{{ debugData.list[0].main.pressure }} mb</h3>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="box next-week">

                        <div class="weather" v-for="dataIndex of weeklyDataWrappperArray">
                            <div class="icon"
                                :style="`background-image: url('/weather/${makeIcon(debugData.list[dataIndex].weather[0].icon)}.svg')`">
                            </div>
                            <div class="status">
                                <h3>{{ makeDayString(debugData.list[dataIndex].dt_txt) }}</h3>
                                <h3>{{ debugData.list[dataIndex].main.temp }}<span>°C</span></h3>
                                <span>{{ makeDescription(debugData.list[dataIndex].weather[0].description) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, getCurrentInstance } from 'vue';
import store from './store';
import { Icon } from '@iconify/vue';
import axios from 'axios';

let debugData: any = ref({ "cod": "200", "message": 0, "cnt": 40, "list": [{ "dt": 1683147600, "main": { "temp": 12.22, "feels_like": 10.59, "temp_min": 12.22, "temp_max": 12.56, "pressure": 1023, "sea_level": 1023, "grnd_level": 921, "humidity": 42, "temp_kf": -0.34 }, "weather": [{ "id": 800, "main": "Snow", "description": "açık", "icon": "13d" }], "clouds": { "all": 0 }, "wind": { "speed": 2.11, "deg": 98, "gust": 2.18 }, "visibility": 10000, "pop": 0, "sys": { "pod": "n" }, "dt_txt": "2023-05-03 21:00:00" }, { "dt": 1683158400, "main": { "temp": 11.82, "feels_like": 10.21, "temp_min": 11.03, "temp_max": 11.82, "pressure": 1022, "sea_level": 1022, "grnd_level": 921, "humidity": 44, "temp_kf": 0.79 }, "weather": [{ "id": 801, "main": "Clouds", "description": "az bulutlu", "icon": "02n" }], "clouds": { "all": 13 }, "wind": { "speed": 2.16, "deg": 86, "gust": 2.19 }, "visibility": 10000, "pop": 0, "sys": { "pod": "n" }, "dt_txt": "2023-05-04 00:00:00" }, { "dt": 1683169200, "main": { "temp": 10.8, "feels_like": 9.19, "temp_min": 10.09, "temp_max": 10.8, "pressure": 1021, "sea_level": 1021, "grnd_level": 920, "humidity": 48, "temp_kf": 0.71 }, "weather": [{ "id": 802, "main": "Clouds", "description": "parçalı az bulutlu", "icon": "03d" }], "clouds": { "all": 37 }, "wind": { "speed": 2.49, "deg": 80, "gust": 2.39 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-04 03:00:00" }, { "dt": 1683180000, "main": { "temp": 15.18, "feels_like": 13.8, "temp_min": 15.18, "temp_max": 15.18, "pressure": 1020, "sea_level": 1020, "grnd_level": 921, "humidity": 40, "temp_kf": 0 }, "weather": [{ "id": 803, "main": "Clouds", "description": "parçalı bulutlu", "icon": "04d" }], "clouds": { "all": 78 }, "wind": { "speed": 1.79, "deg": 88, "gust": 2.63 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-04 06:00:00" }, { "dt": 1683190800, "main": { "temp": 19.8, "feels_like": 18.54, "temp_min": 19.8, "temp_max": 19.8, "pressure": 1019, "sea_level": 1019, "grnd_level": 921, "humidity": 27, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04d" }], "clouds": { "all": 99 }, "wind": { "speed": 2.46, "deg": 160, "gust": 3.6 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-04 09:00:00" }, { "dt": 1683201600, "main": { "temp": 21.25, "feels_like": 20.14, "temp_min": 21.25, "temp_max": 21.25, "pressure": 1017, "sea_level": 1017, "grnd_level": 920, "humidity": 27, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04d" }], "clouds": { "all": 98 }, "wind": { "speed": 3.87, "deg": 190, "gust": 5.66 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-04 12:00:00" }, { "dt": 1683212400, "main": { "temp": 19.28, "feels_like": 18.23, "temp_min": 19.28, "temp_max": 19.28, "pressure": 1015, "sea_level": 1015, "grnd_level": 918, "humidity": 37, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04d" }], "clouds": { "all": 100 }, "wind": { "speed": 3.35, "deg": 117, "gust": 4.91 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-04 15:00:00" }, { "dt": 1683223200, "main": { "temp": 14.53, "feels_like": 13.16, "temp_min": 14.53, "temp_max": 14.53, "pressure": 1016, "sea_level": 1016, "grnd_level": 917, "humidity": 43, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04n" }], "clouds": { "all": 98 }, "wind": { "speed": 1.03, "deg": 134, "gust": 1.15 }, "visibility": 10000, "pop": 0, "sys": { "pod": "n" }, "dt_txt": "2023-05-04 18:00:00" }, { "dt": 1683234000, "main": { "temp": 13.75, "feels_like": 12.33, "temp_min": 13.75, "temp_max": 13.75, "pressure": 1016, "sea_level": 1016, "grnd_level": 917, "humidity": 44, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04n" }], "clouds": { "all": 90 }, "wind": { "speed": 1.72, "deg": 243, "gust": 1.94 }, "visibility": 10000, "pop": 0, "sys": { "pod": "n" }, "dt_txt": "2023-05-04 21:00:00" }, { "dt": 1683244800, "main": { "temp": 11.33, "feels_like": 10.22, "temp_min": 11.33, "temp_max": 11.33, "pressure": 1016, "sea_level": 1016, "grnd_level": 916, "humidity": 65, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04n" }], "clouds": { "all": 90 }, "wind": { "speed": 0.97, "deg": 234, "gust": 1.09 }, "visibility": 10000, "pop": 0, "sys": { "pod": "n" }, "dt_txt": "2023-05-05 00:00:00" }, { "dt": 1683255600, "main": { "temp": 10.86, "feels_like": 9.8, "temp_min": 10.86, "temp_max": 10.86, "pressure": 1015, "sea_level": 1015, "grnd_level": 915, "humidity": 69, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04d" }], "clouds": { "all": 94 }, "wind": { "speed": 0.84, "deg": 315, "gust": 1.22 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-05 03:00:00" }, { "dt": 1683266400, "main": { "temp": 16.83, "feels_like": 15.67, "temp_min": 16.83, "temp_max": 16.83, "pressure": 1014, "sea_level": 1014, "grnd_level": 916, "humidity": 42, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04d" }], "clouds": { "all": 92 }, "wind": { "speed": 0.62, "deg": 41, "gust": 1.43 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-05 06:00:00" }, { "dt": 1683277200, "main": { "temp": 20.8, "feels_like": 19.69, "temp_min": 20.8, "temp_max": 20.8, "pressure": 1013, "sea_level": 1013, "grnd_level": 916, "humidity": 29, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04d" }], "clouds": { "all": 100 }, "wind": { "speed": 1.82, "deg": 122, "gust": 3.19 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-05 09:00:00" }, { "dt": 1683288000, "main": { "temp": 22.29, "feels_like": 21.23, "temp_min": 22.29, "temp_max": 22.29, "pressure": 1010, "sea_level": 1010, "grnd_level": 914, "humidity": 25, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04d" }], "clouds": { "all": 100 }, "wind": { "speed": 5.07, "deg": 134, "gust": 6.25 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-05 12:00:00" }, { "dt": 1683298800, "main": { "temp": 19.73, "feels_like": 18.75, "temp_min": 19.73, "temp_max": 19.73, "pressure": 1009, "sea_level": 1009, "grnd_level": 913, "humidity": 38, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04d" }], "clouds": { "all": 100 }, "wind": { "speed": 4.3, "deg": 67, "gust": 6.53 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-05 15:00:00" }, { "dt": 1683309600, "main": { "temp": 17.12, "feels_like": 16.06, "temp_min": 17.12, "temp_max": 17.12, "pressure": 1010, "sea_level": 1010, "grnd_level": 913, "humidity": 45, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04n" }], "clouds": { "all": 99 }, "wind": { "speed": 1.89, "deg": 122, "gust": 2.8 }, "visibility": 10000, "pop": 0, "sys": { "pod": "n" }, "dt_txt": "2023-05-05 18:00:00" }, { "dt": 1683320400, "main": { "temp": 14.83, "feels_like": 13.94, "temp_min": 14.83, "temp_max": 14.83, "pressure": 1010, "sea_level": 1010, "grnd_level": 912, "humidity": 60, "temp_kf": 0 }, "weather": [{ "id": 500, "main": "Rain", "description": "hafif yağmur", "icon": "10n" }], "clouds": { "all": 100 }, "wind": { "speed": 3.14, "deg": 355, "gust": 4.14 }, "visibility": 10000, "pop": 0.3, "rain": { "3h": 0.26 }, "sys": { "pod": "n" }, "dt_txt": "2023-05-05 21:00:00" }, { "dt": 1683331200, "main": { "temp": 13.42, "feels_like": 12.57, "temp_min": 13.42, "temp_max": 13.42, "pressure": 1008, "sea_level": 1008, "grnd_level": 910, "humidity": 67, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04n" }], "clouds": { "all": 100 }, "wind": { "speed": 3.12, "deg": 35, "gust": 4.76 }, "visibility": 10000, "pop": 0.19, "sys": { "pod": "n" }, "dt_txt": "2023-05-06 00:00:00" }, { "dt": 1683342000, "main": { "temp": 12.06, "feels_like": 11.31, "temp_min": 12.06, "temp_max": 12.06, "pressure": 1008, "sea_level": 1008, "grnd_level": 909, "humidity": 76, "temp_kf": 0 }, "weather": [{ "id": 500, "main": "Rain", "description": "hafif yağmur", "icon": "10d" }], "clouds": { "all": 97 }, "wind": { "speed": 2.66, "deg": 65, "gust": 3.49 }, "visibility": 10000, "pop": 0.29, "rain": { "3h": 0.25 }, "sys": { "pod": "d" }, "dt_txt": "2023-05-06 03:00:00" }, { "dt": 1683352800, "main": { "temp": 14.74, "feels_like": 13.58, "temp_min": 14.74, "temp_max": 14.74, "pressure": 1008, "sea_level": 1008, "grnd_level": 910, "humidity": 50, "temp_kf": 0 }, "weather": [{ "id": 500, "main": "Rain", "description": "hafif yağmur", "icon": "10d" }], "clouds": { "all": 98 }, "wind": { "speed": 4.04, "deg": 66, "gust": 6.21 }, "visibility": 10000, "pop": 0.71, "rain": { "3h": 1.58 }, "sys": { "pod": "d" }, "dt_txt": "2023-05-06 06:00:00" }, { "dt": 1683363600, "main": { "temp": 18.79, "feels_like": 18.03, "temp_min": 18.79, "temp_max": 18.79, "pressure": 1007, "sea_level": 1007, "grnd_level": 910, "humidity": 50, "temp_kf": 0 }, "weather": [{ "id": 500, "main": "Rain", "description": "hafif yağmur", "icon": "10d" }], "clouds": { "all": 93 }, "wind": { "speed": 4.92, "deg": 102, "gust": 7.49 }, "visibility": 10000, "pop": 0.87, "rain": { "3h": 0.62 }, "sys": { "pod": "d" }, "dt_txt": "2023-05-06 09:00:00" }, { "dt": 1683374400, "main": { "temp": 17.94, "feels_like": 17.23, "temp_min": 17.94, "temp_max": 17.94, "pressure": 1004, "sea_level": 1004, "grnd_level": 907, "humidity": 55, "temp_kf": 0 }, "weather": [{ "id": 500, "main": "Rain", "description": "hafif yağmur", "icon": "10d" }], "clouds": { "all": 85 }, "wind": { "speed": 6.37, "deg": 47, "gust": 7.8 }, "visibility": 10000, "pop": 0.86, "rain": { "3h": 0.53 }, "sys": { "pod": "d" }, "dt_txt": "2023-05-06 12:00:00" }, { "dt": 1683385200, "main": { "temp": 14.52, "feels_like": 13.86, "temp_min": 14.52, "temp_max": 14.52, "pressure": 1006, "sea_level": 1006, "grnd_level": 908, "humidity": 70, "temp_kf": 0 }, "weather": [{ "id": 501, "main": "Rain", "description": "orta şiddetli yağmur", "icon": "10d" }], "clouds": { "all": 99 }, "wind": { "speed": 3.13, "deg": 35, "gust": 6.31 }, "visibility": 10000, "pop": 1, "rain": { "3h": 3.88 }, "sys": { "pod": "d" }, "dt_txt": "2023-05-06 15:00:00" }, { "dt": 1683396000, "main": { "temp": 12.73, "feels_like": 12.25, "temp_min": 12.73, "temp_max": 12.73, "pressure": 1009, "sea_level": 1009, "grnd_level": 910, "humidity": 84, "temp_kf": 0 }, "weather": [{ "id": 501, "main": "Rain", "description": "orta şiddetli yağmur", "icon": "10n" }], "clouds": { "all": 100 }, "wind": { "speed": 0.8, "deg": 59, "gust": 2.76 }, "visibility": 9854, "pop": 1, "rain": { "3h": 3.4 }, "sys": { "pod": "n" }, "dt_txt": "2023-05-06 18:00:00" }, { "dt": 1683406800, "main": { "temp": 12.22, "feels_like": 11.72, "temp_min": 12.22, "temp_max": 12.22, "pressure": 1009, "sea_level": 1009, "grnd_level": 910, "humidity": 85, "temp_kf": 0 }, "weather": [{ "id": 501, "main": "Rain", "description": "orta şiddetli yağmur", "icon": "10n" }], "clouds": { "all": 100 }, "wind": { "speed": 1.42, "deg": 346, "gust": 2.29 }, "visibility": 10000, "pop": 0.72, "rain": { "3h": 3.37 }, "sys": { "pod": "n" }, "dt_txt": "2023-05-06 21:00:00" }, { "dt": 1683417600, "main": { "temp": 10.82, "feels_like": 10.2, "temp_min": 10.82, "temp_max": 10.82, "pressure": 1009, "sea_level": 1009, "grnd_level": 910, "humidity": 86, "temp_kf": 0 }, "weather": [{ "id": 500, "main": "Rain", "description": "hafif yağmur", "icon": "10n" }], "clouds": { "all": 100 }, "wind": { "speed": 2.84, "deg": 340, "gust": 4.43 }, "visibility": 10000, "pop": 0.63, "rain": { "3h": 0.67 }, "sys": { "pod": "n" }, "dt_txt": "2023-05-07 00:00:00" }, { "dt": 1683428400, "main": { "temp": 9.49, "feels_like": 7.98, "temp_min": 9.49, "temp_max": 9.49, "pressure": 1011, "sea_level": 1011, "grnd_level": 911, "humidity": 86, "temp_kf": 0 }, "weather": [{ "id": 501, "main": "Rain", "description": "orta şiddetli yağmur", "icon": "10d" }], "clouds": { "all": 100 }, "wind": { "speed": 2.87, "deg": 340, "gust": 4.82 }, "visibility": 10000, "pop": 0.64, "rain": { "3h": 3.8 }, "sys": { "pod": "d" }, "dt_txt": "2023-05-07 03:00:00" }, { "dt": 1683439200, "main": { "temp": 9.51, "feels_like": 7.52, "temp_min": 9.51, "temp_max": 9.51, "pressure": 1013, "sea_level": 1013, "grnd_level": 913, "humidity": 80, "temp_kf": 0 }, "weather": [{ "id": 500, "main": "Rain", "description": "hafif yağmur", "icon": "10d" }], "clouds": { "all": 100 }, "wind": { "speed": 3.75, "deg": 352, "gust": 6.31 }, "visibility": 10000, "pop": 0.67, "rain": { "3h": 1.85 }, "sys": { "pod": "d" }, "dt_txt": "2023-05-07 06:00:00" }, { "dt": 1683450000, "main": { "temp": 10.09, "feels_like": 9.22, "temp_min": 10.09, "temp_max": 10.09, "pressure": 1015, "sea_level": 1015, "grnd_level": 914, "humidity": 79, "temp_kf": 0 }, "weather": [{ "id": 500, "main": "Rain", "description": "hafif yağmur", "icon": "10d" }], "clouds": { "all": 100 }, "wind": { "speed": 4.76, "deg": 8, "gust": 7.07 }, "visibility": 10000, "pop": 0.22, "rain": { "3h": 0.12 }, "sys": { "pod": "d" }, "dt_txt": "2023-05-07 09:00:00" }, { "dt": 1683460800, "main": { "temp": 12.8, "feels_like": 11.86, "temp_min": 12.8, "temp_max": 12.8, "pressure": 1014, "sea_level": 1014, "grnd_level": 915, "humidity": 66, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04d" }], "clouds": { "all": 100 }, "wind": { "speed": 4.03, "deg": 16, "gust": 5.67 }, "visibility": 10000, "pop": 0.2, "sys": { "pod": "d" }, "dt_txt": "2023-05-07 12:00:00" }, { "dt": 1683471600, "main": { "temp": 12.09, "feels_like": 11.13, "temp_min": 12.09, "temp_max": 12.09, "pressure": 1016, "sea_level": 1016, "grnd_level": 916, "humidity": 68, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04d" }], "clouds": { "all": 95 }, "wind": { "speed": 6.26, "deg": 358, "gust": 7.33 }, "visibility": 10000, "pop": 0.01, "sys": { "pod": "d" }, "dt_txt": "2023-05-07 15:00:00" }, { "dt": 1683482400, "main": { "temp": 10.19, "feels_like": 9.12, "temp_min": 10.19, "temp_max": 10.19, "pressure": 1018, "sea_level": 1018, "grnd_level": 917, "humidity": 71, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04n" }], "clouds": { "all": 98 }, "wind": { "speed": 4.38, "deg": 3, "gust": 7.38 }, "visibility": 10000, "pop": 0.06, "sys": { "pod": "n" }, "dt_txt": "2023-05-07 18:00:00" }, { "dt": 1683493200, "main": { "temp": 9.2, "feels_like": 7.69, "temp_min": 9.2, "temp_max": 9.2, "pressure": 1019, "sea_level": 1019, "grnd_level": 918, "humidity": 74, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04n" }], "clouds": { "all": 100 }, "wind": { "speed": 2.78, "deg": 1, "gust": 4.97 }, "visibility": 10000, "pop": 0.03, "sys": { "pod": "n" }, "dt_txt": "2023-05-07 21:00:00" }, { "dt": 1683504000, "main": { "temp": 8.14, "feels_like": 7.07, "temp_min": 8.14, "temp_max": 8.14, "pressure": 1019, "sea_level": 1019, "grnd_level": 918, "humidity": 77, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04n" }], "clouds": { "all": 98 }, "wind": { "speed": 1.95, "deg": 3, "gust": 3.18 }, "visibility": 10000, "pop": 0.03, "sys": { "pod": "n" }, "dt_txt": "2023-05-08 00:00:00" }, { "dt": 1683514800, "main": { "temp": 6.16, "feels_like": 4.72, "temp_min": 6.16, "temp_max": 6.16, "pressure": 1020, "sea_level": 1020, "grnd_level": 918, "humidity": 84, "temp_kf": 0 }, "weather": [{ "id": 803, "main": "Clouds", "description": "parçalı bulutlu", "icon": "04d" }], "clouds": { "all": 71 }, "wind": { "speed": 2, "deg": 19, "gust": 2.44 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-08 03:00:00" }, { "dt": 1683525600, "main": { "temp": 9.26, "feels_like": 8.4, "temp_min": 9.26, "temp_max": 9.26, "pressure": 1020, "sea_level": 1020, "grnd_level": 919, "humidity": 69, "temp_kf": 0 }, "weather": [{ "id": 803, "main": "Clouds", "description": "parçalı bulutlu", "icon": "04d" }], "clouds": { "all": 58 }, "wind": { "speed": 1.92, "deg": 39, "gust": 1.95 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-08 06:00:00" }, { "dt": 1683536400, "main": { "temp": 12.66, "feels_like": 11.23, "temp_min": 12.66, "temp_max": 12.66, "pressure": 1018, "sea_level": 1018, "grnd_level": 918, "humidity": 48, "temp_kf": 0 }, "weather": [{ "id": 804, "main": "Clouds", "description": "kapalı", "icon": "04d" }], "clouds": { "all": 86 }, "wind": { "speed": 1.7, "deg": 29, "gust": 2.06 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-08 09:00:00" }, { "dt": 1683547200, "main": { "temp": 14.98, "feels_like": 13.55, "temp_min": 14.98, "temp_max": 14.98, "pressure": 1016, "sea_level": 1016, "grnd_level": 917, "humidity": 39, "temp_kf": 0 }, "weather": [{ "id": 803, "main": "Clouds", "description": "parçalı bulutlu", "icon": "04d" }], "clouds": { "all": 72 }, "wind": { "speed": 1.38, "deg": 26, "gust": 2.18 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-08 12:00:00" }, { "dt": 1683558000, "main": { "temp": 15.24, "feels_like": 13.79, "temp_min": 15.24, "temp_max": 15.24, "pressure": 1015, "sea_level": 1015, "grnd_level": 916, "humidity": 37, "temp_kf": 0 }, "weather": [{ "id": 803, "main": "Clouds", "description": "parçalı bulutlu", "icon": "04d" }], "clouds": { "all": 52 }, "wind": { "speed": 0.28, "deg": 55, "gust": 2.24 }, "visibility": 10000, "pop": 0, "sys": { "pod": "d" }, "dt_txt": "2023-05-08 15:00:00" }, { "dt": 1683568800, "main": { "temp": 11.59, "feels_like": 10.11, "temp_min": 11.59, "temp_max": 11.59, "pressure": 1016, "sea_level": 1016, "grnd_level": 916, "humidity": 50, "temp_kf": 0 }, "weather": [{ "id": 803, "main": "Clouds", "description": "parçalı bulutlu", "icon": "04n" }], "clouds": { "all": 71 }, "wind": { "speed": 1.79, "deg": 83, "gust": 4.3 }, "visibility": 10000, "pop": 0, "sys": { "pod": "n" }, "dt_txt": "2023-05-08 18:00:00" }], "city": { "id": 323786, "name": "Ankara", "coord": { "lat": 39.9199, "lon": 32.8543 }, "country": "TR", "population": 3517182, "timezone": 10800, "sunrise": 1683082015, "sunset": 1683132237 } });

let weeklyDataWrappperArray = ref<Array<number>>([0, 8, 16, 24, 32]);

weeklyDataWrappperArray.value.forEach((dataIndex) => {
    console.log(debugData.value.list[dataIndex]);
})

const makeDescription = ((d: string) => { let a: string[] = []; d.split(' ').forEach((keyword) => { let s: string[] | string = keyword.split(''); s[0] = s[0].toUpperCase(); s = s.join(''); a.push(s) }); return a.join(' ') });

const makeDayString = ((date_string: string) => {
    let date: Date = new Date(date_string);
    if (date.getDay() == (new Date()).getDay()) {
        return "Bugün";
    }
    return date.toLocaleDateString("tr-TR", { weekday: "long" })
})

const BackgroundBase = ref<HTMLDivElement | null>(null);
const SelectorBase = ref<HTMLDivElement | null>(null);
const Selector = ref<HTMLDivElement | null>(null);
const City = ref<string>("Kocaeli");
const CityName = ref<string>("Kocaeli");
const FocusHolder = ref<HTMLDivElement | null>(null);
const Clock = ref<{ full: string, seconds: string }>({ full: "", seconds: "" });

let selectorToggle = false;

const openCitySelector = () => {
    SelectorBase.value?.classList.toggle("open");
    if (selectorToggle) {
        Selector.value?.classList.toggle("open")
        setTimeout(() => {
            Selector.value?.classList.toggle("display");
        }, 250);
        FocusHolder.value?.classList.remove("open");
        FocusHolder.value!.onclick = () => { };
        return selectorToggle = !selectorToggle;
    }
    Selector.value?.classList.toggle("display");
    setTimeout(() => {
        Selector.value?.classList.toggle("open")
    }, 10);
    FocusHolder.value?.classList.add("open");
    FocusHolder.value!.onclick = () => {
        openCitySelector();
    }
    return selectorToggle = !selectorToggle;
}

const addCity = () => {
    if (!store.state.cities.includes(City.value)) {
        store.state.cities.push(City.value)
        renew();
        store.commit("saveValues");
    }
}

const inputSendEvent = (e: KeyboardEvent) => {
    if (e.key == "Enter") {
        renew();
    }
}

const makeIcon = (icn: string) => {
    let icon: string = "";

    switch (icn) {
        case "01d":
            icon = "Sunny";
            break;

        case "01n":
            icon = "Night";
            break;

        case "02d":
            icon = "CloudSunny";
            break;

        case "02n":
            icon = "CloudyNight";
            break;

        case "03d":
            icon = "Cloudy";
            break;

        case "03n":
            icon = "Cloudy";
            break;

        case "04d":
            icon = "PartlyCloudy";
            break;

        case "04n":
            icon = "PartlyCloudyNight";
            break;

        case "09d":
            icon = "Rainy";
            break;

        case "09n":
            icon = "Rainy";
            break;

        case "10d":
            icon = "Rainy";
            break;

        case "10n":
            icon = "Rainy";
            break;

        case "11d":
            icon = "Thunder";
            break;

        case "11n":
            icon = "Thunder";
            break;

        case "13d":
            icon = "Snow";
            break;

        case "13n":
            icon = "Snow";
            break;

        case "50d":
            icon = "Mist";
            break;

        case "50n":
            icon = "Mist";
            break;

        default:
            break;
    }

    return icon

}

const renew = async () => {


    debugData = ref((await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${City.value}&appid=7668ecf139873b2a00be2b02f0b7d8e1&lang=tr&units=metric`)).data)

    CityName.value = City.value;

    if (selectorToggle) openCitySelector();

    if (["01n", "02n", "03n", "04n", "09n", "10n", "11n", "13n", "50n", "11d"].includes(debugData.value.list[0].weather[0].icon)) {
        document.body.classList.add("night");
    }
    else {
        document.body.classList.remove("night");
    }

    if (["Rainy", "Thunder"].includes(makeIcon(debugData.value.list[0].weather[0].icon))) {
        BackgroundBase.value?.classList.add("rain");
        BackgroundBase.value!.innerHTML = "";

        let hrElement;
        let counter = 100;
        for (let i = 0; i < counter; i++) {
            hrElement = document.createElement("HR");

            hrElement.style.left = Math.floor(Math.random() * BackgroundBase.value!.clientWidth) + "px";
            hrElement.style.animationDuration = 0.2 + Math.random() * 1.9 + "s";
            hrElement.style.animationDelay = Math.random() * 5 + "s";

            BackgroundBase.value?.appendChild(hrElement);
        }
    }

    else if (["Snow"].includes(makeIcon(debugData.value.list[0].weather[0].icon))) {
        BackgroundBase.value?.classList.add("snow");
        BackgroundBase.value!.innerHTML = "";

        let hrElement;
        let counter = 100;
        for (let i = 0; i < counter; i++) {
            hrElement = document.createElement("HR");

            hrElement.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
            hrElement.style.animationDuration = 4 + Math.random() * 8 + "s";
            hrElement.style.animationDelay = Math.random() * 5 + "s";

            BackgroundBase.value?.appendChild(hrElement);
        }
    }

    else {
        BackgroundBase.value!.style.opacity = "0";
        setTimeout(() => {
            BackgroundBase.value!.className = "background";
            BackgroundBase.value!.innerHTML = "";
            BackgroundBase.value!.style.opacity = "1";
        }, 500);


    }

    const instance = getCurrentInstance();
    instance?.proxy?.$forceUpdate();
    instance?.proxy?.$nextTick();

    City.value += " ";
}

store.commit('safeLoadValues');


onMounted(async () => {
    renew();

    setInterval(() => {
        let date = new Date();
        Clock.value.full = `${date.getHours()}:${date.getMinutes()}`
        Clock.value.seconds = `:${date.getSeconds()}`
    }, 1000)
})
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
    color: #fff;
}

svg {
    color: unset !important;

    * {
        color: unset !important;
    }
}

body {
    font-size: clamp(1rem, 1vw, 2rem);
    height: 100vh;
    background: rgb(26, 32, 41);
    background: linear-gradient(0deg, rgba(26, 32, 41, 1) 0%, rgba(49, 96, 146, 1) 65%, rgba(84, 159, 239, 1) 100%);
    background-size: auto 150vh;
    transition: .2s ease;
    transition-property: background-position-y;

    overflow: hidden;
    position: relative;

    &.night {
        background-position-y: -50vh;
    }
}

.background {
    position: absolute;
    width: 140vw;
    height: -webkit-fill-available;
    left: -20vw;
    transition: .2s ease;
    opacity: 0;

    &.rain,
    &.snow {
        opacity: 1;
        overflow: hidden;
    }

    &.rain {
        hr {
            width: 20px;
            height: 2px;
            border-radius: 50%;
            border-color: transparent;
            border-right-color: rgba(255, 255, 255, 0.7);
            border-right-width: 50px;
            position: absolute;
            bottom: 100%;
            transform-origin: 100% 50%;
            animation-name: rain;
            animation-duration: 1s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            filter: blur(1px);
        }
    }

    &.snow {
        hr {
            width: 1px;
            border-color: transparent;
            border-right-color: rgba(255, 255, 255, 0.7);
            border-right-width: 10px;
            position: absolute;
            bottom: 100%;
            transform-origin: 100% 50%;
            animation-name: snow;
            animation-duration: 1s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            filter: blur(2px);
        }
    }
}

.focus-holder {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: auto;
    z-index: 20;

    display: none;

    &.open {
        display: block;
    }
}


.wrapper {
    max-width: 90%;
    width: 100%;
    display: flex;
    margin: 0 auto;

    overflow: hidden;
    position: relative;
}

section.classic {
    height: 100vh;
    width: 100%;

    padding: 3em 4em;
    padding-top: 5em;

    .navbar {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4em;
        background: #0000005F;
        display: flex;
        align-items: center;
        justify-content: center;

        .city {
            position: relative;

            .name {
                cursor: pointer;

                &:hover {
                    span {
                        opacity: .8;
                    }
                }

                span {
                    font-weight: 900;
                    font-style: italic;
                    font-size: 1.4em;
                    text-transform: uppercase;
                    transition: .2s ease;
                    position: relative;

                    .arrow {
                        width: 1.25em;
                        height: 1.25em;
                        font-size: var(--font-size-default);
                        display: inline-block;
                        position: relative;
                        vertical-align: sub;

                        .head {
                            position: absolute;
                            bottom: 40%;
                            left: 50%;
                            transform: translateX(-50%) rotate(45deg);
                            border: solid #fff;
                            border-width: 0 .125em .125em 0;
                            display: inline-block;
                            padding: .25rem;
                            border-radius: .0625em;
                            transition: .2s ease;
                        }

                        .line {
                            width: 0em;
                            height: .1em;
                            background: #fff;
                            position: absolute;
                            bottom: 40%;
                            left: 50%;
                            transform: translateX(-50%) rotate(90deg);
                            transition: .2s ease;
                        }
                    }

                }
            }

            &.open {
                .name span {
                    opacity: .7;

                    .arrow {
                        .head {
                            bottom: 0;
                        }

                        .line {
                            width: 1.25em;
                            height: .1em;
                            background: #fff;
                            position: absolute;
                            bottom: 50%;
                            left: 50%;
                            transform: translateX(-50%) rotate(90deg);
                            transition: .2s ease;
                        }
                    }
                }
            }

            .select {
                display: none;
                margin-top: 0em;
                position: absolute;
                background: #0000005F;
                backdrop-filter: blur(5px);
                padding: 1em 1.2em;
                border-radius: .8em;
                left: 50%;
                transform: translateX(-50%);
                opacity: 0;
                transition: .2s ease;
                z-index: 25;

                &.display {
                    display: block;
                }

                &.open {
                    opacity: 1;
                    margin-top: 1.6em;
                }

                .search {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1em;

                    .input {
                        position: relative;

                        .search-icon {
                            position: absolute;
                            width: 1em;
                            height: 1em;
                            top: 50%;
                            left: .9em;
                            transform: translateY(-50%);
                        }

                        .add {
                            position: absolute;
                            width: 1em;
                            height: 1em;
                            top: 50%;
                            right: .9em;
                            transform: translateY(-50%);

                            background: transparent;
                            border: none;
                            font-size: 1em;

                            cursor: pointer;

                            svg {
                                transition: .2s ease;
                            }

                            &:hover {
                                svg {
                                    color: #0f0 !important;
                                }
                            }
                        }

                        input {
                            font-size: .8em;
                            padding: .8em 3em;
                            /* padding-left: 3em;
                            padding-right: 3em; */
                            background: #0000003F;
                            border: none;
                            border-radius: .4em;
                            transition: .2s ease;

                            outline: none;

                            &:hover {
                                background: #0000005D;
                            }

                            &:focus {
                                background: #0000007D;
                            }

                            &::placeholder {
                                color: #FFFFFF8F;
                            }
                        }
                    }
                }

                .cities {
                    .no-city {
                        text-transform: uppercase;
                        font-size: 1em;
                        text-align: center;
                        font-weight: 900;
                        font-style: italic;
                        opacity: .7;
                    }

                    .city {
                        display: flex;
                        transition: .2s ease;
                        padding: .4em 1em;
                        border-radius: .6em;
                        align-items: center;
                        cursor: pointer;

                        h3 {
                            text-transform: uppercase;
                            font-size: 1em;
                            font-weight: 900;
                            font-style: italic;
                        }

                        &:hover {
                            background: #0000004F;
                        }

                        .control {
                            margin-left: auto;

                            .remove {
                                cursor: pointer;
                                display: flex;

                                svg {
                                    width: 1.1em;
                                    height: 1.1em;
                                    transition: .2s ease;
                                }

                                &:hover {
                                    svg {
                                        color: #f00 !important;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .current {
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap-reverse;

        .weather {
            display: flex;

            align-items: center;

            .icon {
                width: 5em;
                height: 5em;

                /* background: url('/weather/PartlyCloudyNight.svg'); */
                background-size: 100%;
                background-repeat: no-repeat;
            }

            .status {
                margin-left: 1em;

                span {
                    opacity: .75;
                }
            }
        }

        .clock {
            font-size: 3em;
            font-weight: bold;

            span {
                span {
                    font-size: .8em;
                    opacity: .75;
                }
            }
        }
    }

    .continuous {
        margin-top: 2em;
        display: flex;
        flex-direction: column;

        .top {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }

        .bottom {
            display: flex;
            justify-content: center;
        }

        .box {
            border-radius: 1em;
            background-color: rgba(0, 0, 0, 0.6862745098);
            background-image: url("/noise.png");
            backdrop-filter: blur(15px);
            padding: 0.8em 1em;
            margin: 0.2em;
            display: flex;
            overflow: hidden;
            display: inline-flex;
            vertical-align: middle;

            .display {
                display: flex;
            }

            &.next-hour {
                .icon {
                    width: 4em;
                    height: 4em;

                    /* background: url('/weather/Rainy.svg'); */
                    background-size: 100%;
                    background-repeat: no-repeat;
                }

                .status {
                    display: flex;
                    flex-direction: column;
                    margin-left: .8em;

                    span {
                        opacity: .75;
                    }
                }
            }

            &.details {
                display: inline-flex;

                .detail {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                    margin: 0 .4em;

                    svg {
                        width: 2em;
                        height: 2em;
                    }
                }
            }

            &.next-week {
                height: auto;

                overflow: auto;

                .weather {
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    margin: 0 .4em;

                    text-align: center;

                    .icon {
                        width: 4em;
                        height: 4em;

                        /* background: url('/weather/Rainy.svg'); */
                        background-size: 100%;
                        background-repeat: no-repeat;
                    }

                    .status {
                        display: flex;
                        flex-direction: column;
                        margin-left: .8em;

                        span {
                            opacity: .75;
                        }
                    }
                }

            }
        }
    }
}

@keyframes rain {
    from {
        transform: rotate(105deg) translateX(0);
    }

    to {
        transform: rotate(105deg) translateX(calc(100vh + 100px));
    }
}

@keyframes snow {
    from {
        transform: rotate(90deg) translateX(0);
    }

    to {
        transform: rotate(90deg) translateX(calc(100vh + 40px));
    }
}


@media screen and (max-width: 1100px) {
    .wrapper {
        max-width: 1200px;
    }
}

@media screen and (max-width: 600px) {
    section.classic .current {
        justify-content: space-evenly;
    }
}
</style>