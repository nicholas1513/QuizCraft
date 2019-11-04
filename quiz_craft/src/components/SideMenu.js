import React from 'react'
import {Menu} from 'antd';

const { SubMenu } = Menu;

const SideMenu = (props) => {
    return (
        <Menu theme="dark" mode="inline" selectable={false}>
            <SubMenu key="sub1" title={<span>Number of Problems</span>} hidden={props.collapsed}>
            <Menu.Item key="2" onClick={(e)=> {props.updateQCount(e)}} value={5}    >5</Menu.Item>
            <Menu.Item key="3" onClick={(e)=> {props.updateQCount(e)}} value={10}   >10</Menu.Item>
            <Menu.Item key="4" onClick={(e)=> {props.updateQCount(e)}} value={25}   >25</Menu.Item>
            </SubMenu>
        </Menu>
    )
}

export default SideMenu;