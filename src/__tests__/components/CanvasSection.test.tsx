import React from 'react';
import renderer from 'react-test-renderer';

import CanvasSection from '../../components/CanvasSection/CanvasSection';

it('renders CanvasSection', () => {
    const tree = renderer
        .create(<CanvasSection />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
