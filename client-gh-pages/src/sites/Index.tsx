import { useState } from 'react';
import { Collapse } from 'react-bootstrap';

import Home from './Home';
import config from "./list.json";

function Index() {
  const [openItem, setOpenItem] = useState<Number | null>(null);

  const toggleCollapse = (itemId: Number) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  return (
    <div className="container mt-4">
      <div className="list-group">
        {config.map((item, i) => (
          <>
            <div role="button" className="list-group-item list-group-item-action" onClick={() => toggleCollapse(i)} tabIndex={i}>
              {item}
            </div>
            <Collapse in={openItem === i}>
              <div>
                <Home folder_name={item} />
              </div>
            </Collapse>
          </>
        ))}
      </div>
    </div>
  );
};

export default Index;
