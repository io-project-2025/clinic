import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    route("/login", "routes/auth/login.tsx"),
    route("/register", "routes/auth/register.tsx"),

    route("/panel", "routes/panel/main.tsx", [
        route("/panel/umow-wizyte", "routes/panel/umow-wizyte.tsx"),
        route("/panel/wizyty", "routes/panel/wizyty.tsx"),
        route("/panel/badania", "routes/panel/badania.tsx"),
        route("/panel/dokumenty", "routes/panel/dokumenty.tsx"),
        route("/panel/kontakt", "routes/panel/kontakt.tsx"),
    ]),

    
] satisfies RouteConfig;
