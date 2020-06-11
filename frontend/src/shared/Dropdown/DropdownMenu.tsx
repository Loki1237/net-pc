import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';

interface Props {
    placement?: "left" | "right",
    arrow?: boolean,
    control: React.ReactElement,
    onClick?: (event?: React.MouseEvent) => void,
    children?: React.ReactNode
}

const DropdownMenu = (props: Props) => {
    let [menuIsOpened, setMenuState] = React.useState(false);

    const setMenu = () => {
        if (!menuIsOpened) {
            document.addEventListener("click", () => setMenuState(false), { once: true });
        }

        if (props.onClick) {
            props.onClick();
        }
        
        setMenuState(!menuIsOpened);
    }

    let control = <button onClick={setMenu}>Menu</button>

    if (props.control) {
        control = React.cloneElement(props.control, {
            onClick: setMenu
        });
    }

    const arrowClassNames = classNames({
        [styles.arrow]: true,
        [styles.arrow_closed]: !menuIsOpened
    });

    const menuClassNames = classNames({
        [styles.DropdownMenu]: true,
        [styles.closed]: !menuIsOpened,
        [styles.left_placement]: props.placement !== "right",
        [styles.right_placement]: props.placement === "right"
    });
    
    return  (
        <div className={styles.DropdownContainer}>
            {control}

            {props.arrow && <div className={arrowClassNames}></div>}
            <div className={menuClassNames}>
                {props.children}
            </div>
        </div>
    );
}

export default DropdownMenu;
