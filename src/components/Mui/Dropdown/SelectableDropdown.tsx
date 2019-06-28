import React, {
  useRef,
  useState,
  useCallback,
  CSSProperties,
  useEffect,
  useMemo
} from 'react';
import { Omit } from 'react-redux';
import { Dropdown, DropDownProps } from './Dropdown';
import { useMuiMenuItem } from '../Menu/MenuItem';
import { classes } from '../../../utils/classes';

type OmittedDropDownProps = Omit<
  DropDownProps,
  'label' | 'children' | 'onSelect'
>;

type Option = string;

interface Props extends OmittedDropDownProps {
  options: Option[];
  onSelect(index: number): void;
  onClose(): void;
  selectedIndex?: number;
  scrollToIndex?: number;
  placeholder?: string;
  paperClassName?: string;
  calcMenuWidth?(el: HTMLElement): CSSProperties['width'];
}

export function SelectableDropdown({
  anchorEl,
  buttonProps,
  options,
  onSelect,
  onClose,
  selectedIndex,
  scrollToIndex,
  placeholder = '',
  paperClassName = '',
  calcMenuWidth,
  MenuListProps,
  PaperProps,
  ...props
}: Props) {
  const [menuWidth, setMenuWidth] = useState<CSSProperties['width'] | null>(
    null
  );
  const MenuItem = useMuiMenuItem({ onClose });
  const scrollRef = useRef<HTMLUListElement>(null);
  const focusItemRef = useRef<HTMLLIElement | null>(null);
  const scrollToSelectedItem = useCallback(() => {
    if (scrollRef.current && focusItemRef.current) {
      scrollRef.current.scrollTop =
        focusItemRef.current.offsetTop -
        focusItemRef.current.offsetHeight -
        scrollRef.current.offsetHeight / 2;
    }
  }, []);
  const label = useMemo(
    () =>
      typeof selectedIndex !== 'undefined'
        ? options[selectedIndex]
        : placeholder,
    [options, selectedIndex, placeholder]
  );

  const mergedClasses = useMemo(
    () => ({ paper: classes('selectable-dropdown-paper', paperClassName) }),
    [paperClassName]
  );

  const mergedButtonProps = useMemo(
    () => ({
      fullWidth: true,
      classes: { root: 'seletable-mui-dropdown-button' },
      ...buttonProps
    }),
    [buttonProps]
  );

  const mergedPaperProps = useMemo(
    () => ({
      style: menuWidth ? { width: menuWidth } : {},
      ...PaperProps
    }),
    [menuWidth, PaperProps]
  );

  const mergedMenuListProps = useMemo<DropDownProps['MenuListProps']>(
    () => ({
      ...MenuListProps,
      ref: scrollRef,
      style: {
        padding: 0
      }
    }),
    [MenuListProps]
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
      label={label}
      anchorEl={anchorEl}
      classes={mergedClasses}
      onClose={onClose}
      onEnter={scrollToSelectedItem}
      buttonProps={mergedButtonProps}
      PaperProps={mergedPaperProps}
      MenuListProps={mergedMenuListProps}
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
