import React, {
  useRef,
  useState,
  useCallback,
  CSSProperties,
  useEffect,
  useMemo,
  forwardRef
} from 'react';
import { Omit } from 'react-redux';
import { Dropdown, DropDownProps } from './Dropdown';
import { useMuiMenuItem } from '../Menu/MenuItem';
import { SimplebarAPI } from '../../../typings';

interface Props extends Omit<DropDownProps, 'label' | 'onSelect'> {
  options: string[];
  onSelect(index: number): void;
  onClose(): void;
  selectedIndex?: number;
  scrollToIndex?: number;
  placeholder?: string;
  paperClassName?: string;
  calcMenuWidth?(el: HTMLElement): CSSProperties['width'];
}

export type SelectableDropdownProps = Props;

export const SelectableDropdown = forwardRef<HTMLButtonElement, Props>(
  (
    {
      anchorEl,
      calcMenuWidth,
      options,
      onSelect,
      onClose,
      placeholder = '',
      paperClassName = '',
      PaperProps,
      selectedIndex,
      scrollToIndex,
      ...props
    },
    ref
  ) => {
    const [menuWidth, setMenuWidth] = useState<CSSProperties['width']>();
    const MenuItem = useMuiMenuItem({ onClose });
    const simplebarRef = useRef<SimplebarAPI>(null);
    const focusItemRef = useRef<HTMLLIElement | null>(null);
    const scrollToSelectedItem = useCallback(() => {
      if (simplebarRef.current && focusItemRef.current) {
        const scrollEl = simplebarRef.current.getScrollElement();
        scrollEl.scrollTop =
          focusItemRef.current.offsetTop -
          focusItemRef.current.offsetHeight * 2;
      }
    }, []);

    const label = useMemo(
      () =>
        typeof selectedIndex !== 'undefined'
          ? options[selectedIndex]
          : placeholder,
      [options, selectedIndex, placeholder]
    );

    const mergedPaperProps = useMemo(
      () => ({
        style: { width: menuWidth },
        classes: { root: paperClassName },
        ...PaperProps
      }),
      [menuWidth, paperClassName, PaperProps]
    );

    useEffect(() => {
      if (anchorEl instanceof HTMLElement && calcMenuWidth) {
        const width = calcMenuWidth(anchorEl);
        width && setMenuWidth(width);
      }
    }, [anchorEl, calcMenuWidth]);

    return (
      <Dropdown
        {...props}
        anchorEl={anchorEl}
        label={label}
        onClose={onClose}
        onEnter={scrollToSelectedItem}
        PaperProps={mergedPaperProps}
        simplebarRef={simplebarRef}
        ref={ref}
      >
        {options.map((label, index) => (
          <MenuItem
            key={index}
            text={label}
            innerRef={node => {
              if (index === (selectedIndex || scrollToIndex)) {
                focusItemRef.current = node;
              }
            }}
            onClick={() => onSelect(index)}
            selected={index === selectedIndex}
          />
        ))}
      </Dropdown>
    );
  }
);
