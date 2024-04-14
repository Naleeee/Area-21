import axios from 'axios';
import Area from '../../models/area.model';

type Humidity = {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime_epoch: number;
        localtime: string;
    };
    current: {
        last_updated_epoch: number;
        last_updated: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        vis_km: number;
        vis_miles: number;
        uv: number;
        gust_mph: number;
        gust_kph: number;
    };
};

type Humidity_data = {
    is_already_trigger: boolean;
};

async function updateAreaHumidity(
    area_id: number,
    humidity_data: Humidity_data
) {
    await Area.update(
        {
            action_data: {is_already_trigger: humidity_data.is_already_trigger}
        },
        {
            where: {
                area_id: area_id
            }
        }
    );
}

export async function checkHumidity(areaId: number) {
    const area: Area | null = await Area.findOne({
        where: {
            area_id: areaId
        }
    });

    if (
        area == null ||
        !area.get().action_arguments ||
        !area.get().action_arguments.city ||
        !area.get().action_arguments.humidity
    )
        return false;

    const city: string = area.get().action_arguments.city;

    let current_humidity: Humidity;
    const max_humidity: number = area.get().action_arguments.humidity;
    try {
        current_humidity = (
            await axios.get(
                `http://api.weatherapi.com/v1/current.json?key=${process.env.API_WEATHER_KEY}&q=${city}`
            )
        ).data;
        if (
            current_humidity.current.humidity > max_humidity &&
            area.get().action_data &&
            area.get().action_data.is_already_trigger == false
        ) {
            const humidity_data: Humidity_data = {is_already_trigger: true};
            await updateAreaHumidity(areaId, humidity_data);
            return true;
        } else if (
            area.get().action_data == null ||
            (current_humidity.current.humidity <= max_humidity &&
                area.get().action_data.is_already_trigger)
        ) {
            const humidity_data: Humidity_data = {is_already_trigger: false};
            await updateAreaHumidity(areaId, humidity_data);
            return false;
        }
        return false;
    } catch (e) {
        console.log('error in humidity', e);
        return false;
    }
}
