/**
 * @format
 */

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Application from 'asmr/Application';

// Note: test renderer must be required after react-native.
it('renders correctly', () => {
	renderer.create(<Application />);
});
