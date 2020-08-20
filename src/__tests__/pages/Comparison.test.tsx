import React from 'react';
import renderer from 'react-test-renderer';

import Comparison from '../../pages/Comparison';

it('renders Comparison', () => {
    const tree = renderer
        .create(<Comparison />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
