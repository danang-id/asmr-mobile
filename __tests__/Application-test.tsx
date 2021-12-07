/**
 * @format
 */

import 'react-native';
import Application from 'asmr/Application';
import React from 'react';
import renderer from 'react-test-renderer';

// Note: test renderer must be required after react-native.
it('renders correctly', () => {
	renderer.create(<Application />);
});
