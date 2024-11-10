import { getElementCenter } from '../helpers';

describe('getElementCenter', () => {
    let element: HTMLElement;

    beforeEach(() => {
        element = document.createElement('div');
        document.body.appendChild(element);
    });

    afterEach(() => {
        element.remove();
    });

    it('should calculate center of element with specific dimensions and position', () => {
        const mockRect = {
            left: 100,
            top: 100,
            width: 200,
            height: 150
        };
        
        jest.spyOn(element, 'getBoundingClientRect').mockImplementation(() => ({
            ...mockRect,
            right: mockRect.left + mockRect.width,
            bottom: mockRect.top + mockRect.height,
            x: mockRect.left,
            y: mockRect.top,
            toJSON: () => {}
        }));

        const center = getElementCenter(element);

        expect(center.x).toBe(200);
        expect(center.y).toBe(175);
    });

    it('should handle zero dimensions', () => {
        const mockRect = {
            left: 50,
            top: 50,
            width: 0,
            height: 0
        };
        
        jest.spyOn(element, 'getBoundingClientRect').mockImplementation(() => ({
            ...mockRect,
            right: mockRect.left + mockRect.width,
            bottom: mockRect.top + mockRect.height,
            x: mockRect.left,
            y: mockRect.top,
            toJSON: () => {}
        }));

        const center = getElementCenter(element);

        expect(center.x).toBe(50);
        expect(center.y).toBe(50);
    });

    it('should handle negative positions', () => {
        const mockRect = {
            left: -100,
            top: -100,
            width: 200,
            height: 200
        };
        
        jest.spyOn(element, 'getBoundingClientRect').mockImplementation(() => ({
            ...mockRect,
            right: mockRect.left + mockRect.width,
            bottom: mockRect.top + mockRect.height,
            x: mockRect.left,
            y: mockRect.top,
            toJSON: () => {}
        }));

        const center = getElementCenter(element);

        expect(center.x).toBe(0);
        expect(center.y).toBe(0);
    });

    it('should calculate center for element at origin', () => {
        const mockRect = {
            left: 0,
            top: 0,
            width: 100,
            height: 100
        };
        
        jest.spyOn(element, 'getBoundingClientRect').mockImplementation(() => ({
            ...mockRect,
            right: mockRect.left + mockRect.width,
            bottom: mockRect.top + mockRect.height,
            x: mockRect.left,
            y: mockRect.top,
            toJSON: () => {}
        }));

        const center = getElementCenter(element);

        expect(center.x).toBe(50);
        expect(center.y).toBe(50);
    });
});