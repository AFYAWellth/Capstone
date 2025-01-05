'use client'
import React, {useState, useEffect, useRef, ReactNode} from 'react';

interface DropdownItemProps {
    img: string;
    text: string;
}
type Props = {
    children: ReactNode;
}
export function NavTwo(props :Props) {
    const {children} = props
    const [open, setOpen] = useState<boolean>(false);
    const [timedPopup, setTimedPopup] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            setTimedPopup(true);
        }, 5000);
    }, []);

    // Type for useRef
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
                //console.log(menuRef.current);
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, []);

    return (
        <div className="App">
            {children}
            {/*<div className="nav-flex">*/}
            {/*    /!* Drop Down Menu Functionality *!/*/}
            {/*    <div className='settings-container' ref={menuRef}>*/}
            {/*        <div className='menu-trigger' onClick={() => setOpen(!open)}>*/}
            {/*            <img src="/gear.png" alt="Settings" />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*<div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>*/}
            {/*    /!* Drop Down Items *!/*/}
            {/*    <ul>*/}
            {/*        <DropdownItem img="/edit.png" text="Edit Profile" />*/}
            {/*        <DropdownItem img="/pawprint.png" text="My Pets" />*/}
            {/*        <DropdownItem img="/gear.png" text="Settings" />*/}
            {/*        <DropdownItem img="/log-out.png" text="Logout" />*/}
            {/*    </ul>*/}
            {/*</div>*/}

            {/* Uncomment to use Popup */}
            {/* <Popup trigger={timedPopup} setTrigger={setTimedPopup}> */}
            {/* </Popup> */}
        </div>
    );
}

function DropdownItem({ img, text }: DropdownItemProps) {
    return (
        <li className="dropdownItem">
            <img src={img} alt={text}/>
            <a>{text}</a>
        </li>
    );
}
