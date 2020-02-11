import React from 'react';
import styles from './Messages.css';

import AppStateType from '../../types/AppStateType';

interface PropsType {
    appState: AppStateType
}

class Messages extends React.Component <PropsType, {}> {
    fileInput: any;
    constructor(props: PropsType) {
        super(props);
        this.fileInput = React.createRef();
    }

    render() {
        return (
            <div className={styles.Messages}>
                <h2>Messages</h2>
                
                <form id="formElem"
                    onSubmit={async (e) => {
                        e.preventDefault();

                        let elem = new FormData();
                        elem.append("avatar", this.fileInput.current.files[0]);
                        
                        await fetch('/api/users/upload-avatar', {
                            method: "POST",
                            headers: {
                                "Content-Type": "form/multipart"
                            },
                            body: this.fileInput.current.files[0]
                        });

                        console.log(this.fileInput.current.files[0]);
                    }}
                >
                    <input type="file" name="avatar" ref={this.fileInput} />
                    <input type="submit" value="Загрузить" />
                </form>
            </div>
        );
    }
}

export default Messages;
