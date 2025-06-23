import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/panel", "routes/panel/index.tsx", [
        index("routes/panel/users.tsx"),
        route("timetable", "routes/panel/grafik.tsx"),
        route("stats", "routes/panel/statystyki.tsx"),
        route("console", "routes/panel/konsola.tsx")
    ])
] satisfies RouteConfig;
