import React from 'react';
import styles from './Styles.m.css';

const DropdownContainer = props => {
    let [menu, setMenu] = React.useState(false);

    if (React.Children.count(props.children) !== 2) {
        console.log("There must be two elements");
        return <span style={{ color: "red" }}>There must be two elements</span>;
    }

    const Button = React.cloneElement(props.children[0], {
        onClick: () => setMenu(!menu)
    });

    const DropdownMenu = React.cloneElement(props.children[1], {
        open: menu,
        onClose: () => setMenu(false)
    });

    return (
        <div className={styles.DropdownContainer}
            style={props.style}
        >
            {Button}
            {DropdownMenu}
        </div>
    );
}

export default DropdownContainer;
