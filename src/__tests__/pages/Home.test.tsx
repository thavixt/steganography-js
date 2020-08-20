import React from 'react';
import renderer from 'react-test-renderer';

import Home from '../../pages/Home';

it('renders Home', () => {
    const tree = renderer
        .create(<Home />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
