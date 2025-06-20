import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    
    index("routes/login.tsx"),
    route("/panel", "routes/panel/panel.tsx", [
        index("routes/panel/start.tsx"),
        route("timetable", "routes/panel/grafik.tsx"),
        route("visits", "routes/panel/wizyty/dzisiejsze-wizyty.tsx"),
        route("visits/new", "routes/panel/wizyty/nowe-wizyty.tsx"),
        route("holidays", "routes/panel/ferie.tsx"),
        route("patients", "routes/panel/pacjenci.tsx"),
    ]
    )
    
] satisfies RouteConfig;
