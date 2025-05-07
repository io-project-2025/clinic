function Header({headerContent, headerClassName, hClassName}) {
    return (
        <header className={headerClassName}>
            <h1 className={hClassName}> {headerContent} </h1>
        </header>
    );
}

export default Header