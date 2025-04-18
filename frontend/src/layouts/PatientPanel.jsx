import MainLink from "../components/MainLink";
import { ReactSVG } from "react-svg";

const Information = () => {
    return (
        <div>
            <strong className="text-xl">Zalogowany pacjent: </strong> <span>Loading...</span>
        </div>
    );
}

const Header = () => {
    return (
        <header>
            <h1>Patient Panel</h1>
            <nav>
                {/* <MainLink link="/" className="w-8" render={<ReactSVG 
                    src="home.svg" 
                    beforeInjection= {(svg) => {
                        svg.setAttribute('style', 'width: 5%')
                    }}/>}
                  /> */}
            </nav>
            <Information />
        </header>
    );
}

const commonButtonClass = "bg-slate-50 hover:bg-blue-700 text-black font-bold rounded margin-2";

const buttonsContent = [
    {
        txt: "Panel wizyt",
        link: "visits",
        className: commonButtonClass + " "
    },
    {
        txt: "Wyniki badań",
        link: "results",
        className: commonButtonClass + " "

    },
    {
        txt: "Dokumentacja medyczna i skierowania",
        link: "documentation",
        className: commonButtonClass + " "
    }
]


export default () => {
    return (

        <div>
            <Header/>
            <main className="bg-gray-300">
                <div className="grid grid-cols-2 gap-4">
                    {
                        buttonsContent.map((button, index) => (
                            <MainLink key={index} txt={button.txt} link={button.link} className={button.className}/>
                    ))}
                </div>
            </main>
        </div>
    );
}