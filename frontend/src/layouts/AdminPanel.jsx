import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default () => {
  return (
    <div className={"bg-[var(--background)] text-[var(--text)] h-screen w-full flex justify-center items-center"}>
      
      <div className="grid grid-cols-6 grid-rows-8 h-[95%] w-[95%] ">
      
          <div className="rounded-xl flex justify-center border-b-2 border-r-2 bg-gradient-to-l from-[var(--primary)] to-[var(--secondary)]"> 
            <h2 className="self-center" >LOGO</h2>
          </div>

          <Header
              headerContent="header content"
              headerClassName="rounded-xl col-span-5 flex justify-center border-b-2 bg-[var(--primary)]"
              hClassName="self-center"
          />


          <Sidebar
            buttonContent={[
            { name: "home", text: "Home", icon: "🏠" },
            { name: "about", text: "About", icon: "ℹ️" },
            { name: "contact", text: "Contact", icon: "📞" },
            ]}
            asideClassName="rounded-xl border-r-2 col-span-1 row-span-7  h-full flex flex-col bg-gradient-to-l from-[var(--primary)] to-[var(--secondary)]"
            buttonClassName="w-[100%] mt-2 h-16 flex justify-evenly items-center cursor-pointer hover:scale-120 transition duration-300 ease-in-out"
          />

          <main className="rounded-xl bg-[var(--primary)] col-span-5 row-span-7 flex flex-col justify-center items-center">
              {/* Main content goes here */}
          </main>
      </div>

    </div>
  );
}