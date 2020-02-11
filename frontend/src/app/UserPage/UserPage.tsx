import React from 'react';
import styles from './UserPage.css';
import Backdrop from '../../components/Backdrop/Backdrop';
import ModalWindow from '../../components/Modal/ModalWindow';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import Button from '../../components/Button/Button';

interface Props {
    
}

interface State {
    avatar: string,
    userName: string,
    birthday: string
}

class UserPage extends React.Component <{}, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            avatar: "",
            userName: "",
            birthday: ""
        };
    }

    async componentDidMount() {
        const resUser = await fetch('/api/users/login-as', { method: "POST" });
        const user = await resUser.json();
        const resAvatar = await fetch(`/api/avatars/${user.id}.jpg`);
        const birthday = user.birthday.split('-');

        this.setState({ 
            avatar: resAvatar.url,
            userName: user.firstName + " " + user.lastName,
            birthday: `${birthday[2]}.${birthday[1]}.${birthday[0]}`
        });
    }

    render() {
        return (
            <div className={styles.UserPage}>

                <div className={styles.avatar}>
                    <img src={this.state.avatar} width="200" height="200" alt="*" />
                </div>

                <div className={styles.userData}>
                    <p className={styles.userName}>{this.state.userName}</p>
                    <p className={styles.userPropertie}>Birthday: {this.state.birthday}</p>
                    <p className={styles.userPropertie}>About self:</p>
                </div>

                <div className={styles.other}>
                    
                </div>
                
            </div>
        );
    }
}

export default UserPage;
