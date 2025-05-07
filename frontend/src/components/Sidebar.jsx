function Sidebar({buttonContent, asideClassName, buttonClassName, onClickButton}) {
  return (
    <aside className={asideClassName}>
      <ul>
        {buttonContent.map((item, index) => {
            return (
                <li key={index}>
                    <button className={buttonClassName} onClick={() => onClickButton(item.name)}>
                        <span className="w-[70%] flex justify-evenly">
                            <span className="self-center">{item.icon}</span>
                            <span className="self-center">{item.text}</span>
                        </span>
                    </button>
                </li>
            );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;