import React from 'react';
import styles from './Settings.css';

import Button from '../../components/Button/Button';
import Tooltip from '../../components/Tooltip/Tooltip';
import DropdownContainer from '../../components/Dropdown/DropdownContainer';
import DropdownMenu from '../../components/Dropdown/DropdownMenu';
import DropdownItem from '../../components/Dropdown/DropdownItem';
import Select from '../../components/Select/Select';

interface PropsType {
    showAlert: Function
}

interface StateType {
    dropdown: boolean,
    selectedOption: any,
    selectedColor: string
}

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

export const selectStyles = {
    option: (provided: any, state: any) => ({
        ...provided,
        color: state.isSelected ? "#FFF" : "#444",
        fontSize: 16,
        backgroundColor: state.isSelected ? "var(--primary-color)" : "",
        textAlign: "left",
        cursor: "pointer"
    }),
    container: (base: any) => ({
        ...base,
        width: "100%"
    }),
    control: (base: any, state: any) => ({
        ...base,
        height: 32,
        minHeight: 32,
        fontSize: 16,
        borderRadius: 3,
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        boxShadow: "none",
        borderColor: state.isFocused ? "var(--primary-color)" : "var(--line-color)"
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        display: "none",
    }),
    indicatorSeparator: (base: any) => ({
        ...base,
        display: "none"
    }),
    valueContainer: (base: any) => ({
        ...base,
        padding: 0,
        paddingLeft: 2
    })
};
  

class Settings extends React.Component <PropsType, StateType> {
    showAlert: Function;

    constructor(props: PropsType) {
        super(props);
        this.showAlert = this.props.showAlert;
        this.state = {
            dropdown: false,
            selectedOption: null,
            selectedColor: ""
        };
    }

    setDropdown = (value?: boolean) => {
        this.setState({ dropdown: value !== undefined ? value : this.state.dropdown === false });
    }

    handleChange = (selectedOption: any) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };

    render() {
        return (
            <div className={styles.Settings}>
                <Button color="info" style={{ margin: 6 }}
                    onClick={() => this.showAlert("info", "Information message")}
                >
                    Info
                </Button>

                <Button color="success" style={{ margin: 6 }}
                    onClick={() => this.showAlert("success", "Success message")}
                >
                    Success
                </Button>

                <Button color="warning" style={{ margin: 6 }}
                    onClick={() => this.showAlert("warning", "Warning message")}
                >
                    Warning
                </Button>

                <Button color="error" style={{ margin: 6 }}
                    onClick={() => this.showAlert("error", "Error message")}
                >
                    Error
                </Button>

                <Button color="primary" style={{ margin: 6 }}>
                    Primary
                </Button>

                <DropdownContainer style={{ margin: 6 }}>
                    <Button color="secondary" onClick={() => this.setDropdown()}>
                        Dropdown
                    </Button>
                    <DropdownMenu open={this.state.dropdown} 
                        placement="right"
                        onClose={() => this.setDropdown(false)}
                    >
                        <DropdownItem>
                            Редактировать
                        </DropdownItem>

                        <DropdownItem>
                            Удалить
                        </DropdownItem>
                    </DropdownMenu>
                </DropdownContainer>
                
                <Select outline
                    value={this.state.selectedColor}
                    onChange={(color: string) => {
                        this.setState({ selectedColor: color });
                    }}
                    options={[
                        { label: "Red", value: "red"},
                        { label: "Green", value: "green"},
                        { label: "Blue", value: "blue"}
                    ]}
                />

                <Button color="primary"
                    onClick={() => console.log(this.state.selectedColor)}
                >
                    Show option
                </Button>
            </div>
        );
    }
}

export default Settings;
