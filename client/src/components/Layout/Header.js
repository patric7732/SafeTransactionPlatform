import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

import classes from "./Header.module.css";
import DropdownMenu from "./DropdownMenu";
import UserAuth from "./UserAuth";

const Header = (props) => {
  const location = useLocation();

  // 현재 경로가 로그인 페이지인 경우 Header를 렌더링하지 않음
  if (location.pathname === "/Login" || location.pathname === "/Register") {
    return null;
  }

  return (
    <Fragment>
      <header className={classes.header}>
        <div className={classes.list}>
          <Link to="/" className={classes.link}>
            <h1 className={classes.logo}>PANDA.</h1>
          </Link>

          <ul className={classes.list2}>
            <div className={classes.dropdown}>
              <li className={classes.list2Item}>
                <Link to="/Purchase/" className={classes.purchaseLink}>
                  구매하기
                </Link>
              </li>

              <div className={classes.dropdownContent}>
                <DropdownMenu />
              </div>
            </div>

            <Link to="/AddProduct/" className={classes.AddProductLink}>
              <li className={classes.list2Item}>판매하기</li>
            </Link>
          </ul>

          <div className={classes.searchBox}>
            <input type="text" className={classes.search} />

            <button>
              <FiSearch />
            </button>
          </div>
        </div>

        <div className={classes.AuthList}>
          <Link to="/Login" className={classes.link}>
            <UserAuth />
          </Link>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;