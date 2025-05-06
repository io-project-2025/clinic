import MainLink from "../components/MainLink";
import { Home, User } from 'lucide-react';

// paleta kolorów - https://coolors.co/000500-362417-92817a-f1dabf-fffbff

const Information = () => {
    return (
        <div className="text-center text-[var(--text)]">
            <strong className="text-xl">Zalogowany pacjent: </strong> <span>Loading...</span>
        </div>
    );
}

const Header = () => {
    return (
        <header>
            <h1 className="ml-4">Patient Panel</h1>
            <nav>

                <MainLink link="/" linkClass="w-10 inline-block ml-4"  
                render={<User className="h-10 w-10 text-[var(--secondary)] hover:text-[var(--text)] transition duration-300 ease-in-out" />}
                />
                
                <MainLink link="/" linkClass="w-10 inline-block ml-4"  
                render={<Home className="h-10 w-10 text-[var(--secondary)] hover:text-[var(--text)] transition duration-300 ease-in-out" />}
                />
              
            </nav>
            <Information />
        </header>
    );
}


const commonButtonClass = "font-bold rounded-full m-2 w-[15vw] h-[15vw] flex justify-center items-center text-center  transition duration-300 ease-in-out ";
const leftButtonsClass = "bg-[var(--primary)] text-[var(--text)]  hover:shadow-2xl hover:shadow-[var(--shadow-secondary)] ";
const rightButtonsClass = "w-[30vw] h-[30vw] bg-[var(--secondary)] text-[var(--primary)] hover:shadow-2xl hover:shadow-[var(--shadow-primary)] ";


const buttonsContent = [
    {
        txt: "Panel wizyt",
        link: "visits",
        className: commonButtonClass + leftButtonsClass
    },
    {
        txt: "Dokumentacja medyczna i skierowania",
        link: "documentation",
        className: commonButtonClass + rightButtonsClass,
        linkClass: "row-span-2"
    },
    {
        txt: "Wyniki badań",
        link: "results",
        className: commonButtonClass + leftButtonsClass

    },

]

const Footer = () => {
    return (
        <footer className="text-center border-t-2 border-[#000500] mt-4 pd-4">
            <pre>Kontakt: +48 123-456-789        © 2023 SZPM</pre>
        </footer>
    );

}


export default () => {
    return (

        <div className="bg-gradient-to-l to-[var(--background)] from-[var(--accent)] h-screen">
            <Header/>
            <main className="pt-8 pb-20 w-[80%] block mx-auto">
                <div className="grid grid-cols-2 grid-rows-2 gap-4  place-items-center">
                    {
                        buttonsContent.map((button, index) => (
                            <MainLink key={index} txt={button.txt} link={button.link} className={button.className} linkClass={button.linkClass}/>
                    ))}
                </div>
            </main>
            <Footer/>
        </div>
    );
}