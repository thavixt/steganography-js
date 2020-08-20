import React from 'react';
import renderer from 'react-test-renderer';

import TextAreaSection from '../../components/TextAreaSection/TextAreaSection';

it('renders CanvasSection', () => {
    const tree = renderer
        .create(<TextAreaSection />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
