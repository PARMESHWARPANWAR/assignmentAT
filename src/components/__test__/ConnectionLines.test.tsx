import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConnectionLines } from '../ConnectionLines';
import '@testing-library/jest-dom';

jest.mock('../../utils/helpers', () => ({
    getElementCenter: jest.fn().mockReturnValue({ x: 100, y: 100 }),
}));

describe('ConnectionLines', ()=>{
    const defaultProps = {
        connections:[
            {from:'point1', to:'point2'},
            {from:'point3', to:'point4'}
        ],
    };

    beforeEach(() => {
        // Mock DOM elements for connection points
        document.body.innerHTML = `
          <div id="point1"></div>
          <div id="point2"></div>
          <div id="point3"></div>
          <div id="point4"></div>
        `;
    });

    it('renders SVG with correct number of paths', () => {
        render(<ConnectionLines {...defaultProps} />);
        const paths = document.querySelectorAll('path');
        expect(paths.length).toBe(2); // One path per connection
    });

    it('updates paths on hover', () => {
        render(<ConnectionLines {...defaultProps} />);
        const pathGroup = document.querySelector('g');
        fireEvent.mouseOver(pathGroup!);
        const paths = document.querySelectorAll('path');
        expect(paths.length).toBe(3); // Original path plus highlighted path
    });

    it('removes highlight on mouse leave', () => {
        render(<ConnectionLines {...defaultProps} />);
        const pathGroup = document.querySelector('g');
        fireEvent.mouseOver(pathGroup!);
        fireEvent.mouseLeave(pathGroup!);
        const paths = document.querySelectorAll('path');
        expect(paths.length).toBe(2); // Back to original paths only
    });
})