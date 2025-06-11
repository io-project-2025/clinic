import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Box } from "@mui/material";
import { Link as RouterLink } from "react-router";
import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

const articles = [
	{
		title: "Jak dbać o zdrowie psychiczne?",
		image: "https://farmapol.pl/wp-content/uploads/2023/08/2-790x790.png",
		excerpt: "Poznaj sprawdzone sposoby na poprawę samopoczucia i radzenie sobie ze stresem.",
	},
	{
		title: "Zdrowa dieta – co warto wiedzieć?",
		image: "https://superflavon.eu/public/assets//Piramida%20zdrowego%20%C5%BCywienia.png",
		excerpt: "Dowiedz się, jak komponować posiłki, by czuć się lepiej każdego dnia.",
	},
	{
		title: "Aktywność fizyczna dla każdego",
		image: "https://www.gov.pl/photo/format/0f68528c-8877-4f05-a1f9-cd7bd339a85d/resolution/1920x810",
		excerpt: "Proste ćwiczenia, które możesz wykonywać w domu lub na świeżym powietrzu.",
	},
	{
		title: "Profilaktyka – dlaczego jest ważna?",
		image: "https://centramedycznemedyceusz.pl/images/Okazjonalne/400x289xprogram-porfilaktyki-chorb-ukdu-krenia-art.png.pagespeed.ic.0lt-wugsJ_.png",
		excerpt: "Regularne badania mogą uratować życie. Sprawdź, o czym warto pamiętać.",
	},
];

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<Box>
			<AppBar position="static" color="primary">
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						Klinika Zdrowia
					</Typography>
					<Button color="inherit" component={RouterLink} to="/login">
						Zaloguj się
					</Button>
					<Button color="inherit" component={RouterLink} to="/register">
						Zarejestruj się
					</Button>
				</Toolbar>
			</AppBar>
			<Container sx={{ mt: 4 }}>
				<Typography variant="h4" gutterBottom align="center">
					Dla Ciebie
				</Typography>
				<Grid container spacing={4}>
					{articles.map((article, idx) => (
						<Grid item xs={12} sm={6} md={3} key={idx}>
							<Card
								sx={{
									transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s",
									"&:hover": {
										transform: "scale(1.05)",
										boxShadow: 6,
									},
									cursor: "pointer",
								}}
							>
								<Box
									sx={{
										height: 180,
										backgroundImage: `url(${article.image})`,
										backgroundSize: "cover",
										backgroundPosition: "center",
										backgroundRepeat: "no-repeat",
									}}
								/>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										{article.title}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{article.excerpt}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
}
