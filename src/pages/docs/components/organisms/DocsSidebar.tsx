import { useLocation } from 'react-router-dom';
import Sidebar from '../../../../components/organisms/Sidebar';
import { docsMenu } from '../../../../router/routes';

export default function DocsSidebar() {
  const location = useLocation();

  const splitted = location.pathname.split('/');
  const endpoint = splitted[splitted.length - 1];

  return (
    <aside className="sm:w-52">
      <Sidebar>
        {docsMenu.map((menu) => (
          <Sidebar.Ul key={menu.name} title={menu.name}>
            {menu.children.map((submenu) => (
              <Sidebar.Li
                key={submenu.name}
                to={menu.route + submenu.route}
                selected={endpoint === submenu.route}
              >
                {submenu.name}
              </Sidebar.Li>
            ))}
          </Sidebar.Ul>
        ))}
      </Sidebar>
    </aside>
  );
}