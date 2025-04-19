import MainLink from "../components/MainLink";
import { Home, User } from 'lucide-react';

// paleta kolorów - https://coolors.co/000500-362417-92817a-f1dabf-fffbff

const Information = () => {
    return (
        <div className="text-center">
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
                render={<User className="h-10 w-10 text-[#000500] hover:text-[#FFFBFF] transition duration-300 ease-in-out" />}
                />
                
                <MainLink link="/" linkClass="w-10 inline-block ml-4"  
                render={<Home className="h-10 w-10 text-[#000500] hover:text-[#FFFBFF] transition duration-300 ease-in-out" />}
                />
              
            </nav>
            <Information />
        </header>
    );
}

const commonButtonClass = "font-bold rounded-full m-2 w-[15vw] h-[15vw] flex justify-center items-center text-center  transition duration-300 ease-in-out ";

const buttonsContent = [
    {
        txt: "Panel wizyt",
        link: "visits",
        className: commonButtonClass + "bg-[#FFFBFF] text-[#000500]  hover:bg-[#000500] hover:text-[#FFFBFF]"
    },
    {
        txt: "Dokumentacja medyczna i skierowania",
        link: "documentation",
        className: commonButtonClass + "w-[30vw] h-[30vw] hover:bg-[#FFFBFF] hover:text-[#000500] bg-[#000500] text-[#FFFBFF]",
        linkClass: "row-span-2"
    },
    {
        txt: "Wyniki badań",
        link: "results",
        className: commonButtonClass + "bg-[#FFFBFF] text-[#000500]  hover:bg-[#000500] hover:text-[#FFFBFF]"

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

        <div className="bg-gradient-to-l to-[#92817A] from-[#F1DABF] h-screen">
            <Header/>
            <main className="pt-8 pb-20">
                <div className="grid grid-cols-2 grid-rows-2 gap-4 place-items-center">
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