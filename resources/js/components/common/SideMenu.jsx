import React from 'react';
import {Link} from 'react-router-dom';

import User from './User';
import SideMenuNav from './SideMenuNav';

class SideMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <Link to="/" className="brand-link">
                    <span className="brand-text font-weight-light">Home</span>
                </Link>
                <div className="sidebar os-host os-theme-light os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-transition">
                    <div className="os-resize-observer-host observed">
                        <div className="os-resize-observer"></div>
                    </div>
                    <div className="os-padding">
                        <div className="os-viewport os-viewport-native-scrollbarsinvisible">
                            <div className="os-content">
                                <User type="side-menu"/>
                                <SideMenuNav />
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        )
    }
}

export default SideMenu;