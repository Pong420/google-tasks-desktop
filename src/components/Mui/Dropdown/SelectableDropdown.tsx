import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  CSSProperties,
  useMemo
} from 'react';
import { Omit } from 'react-redux';
import { Dropdown, DropDownProps } from './Dropdown';
import { useMuiMenu } from '../Menu';
import { useMenuItem, MenuItemProps } from '../MenuItem';
import { classes } from '../../../utils/classes';

type OmittedDropDownProps = Omit<
  DropDownProps,
  'label' | 'anchorEl' | 'onClick' | 'open' | 'children' | 'onSelect'
>;

interface Props extends OmittedDropDownProps {
  items: MenuItemProps[];
  selectedIndex?: number;
  scrollToIndex?: number;
  paperClassName?: string;
  calcMenuWidth?(el: HTMLElement): CSSProperties['width'];
  onSelect(index: number): void;
}

export function SelectableDropdown({
  items,
  selectedIndex: initialSelectedIndex = 0,
  scrollToIndex,
  calcMenuWidth,
  paperClassName = '',
  buttonProps,
  onSelect,
  ...props
}: Props) {
  const { anchorEl, setAnchorEl, onClose } = useMuiMenu();
  const MenuItem = useMenuItem(onClose);
  const [menuWidth, setMenuWidth] = useState<CSSProperties['width']>(0);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLLIElement | null>(null);
  const scrollToSelectedItem = useCallback(() => {
    // setTimeout is not a good solution but work ...
    if (scrollRef.current && selectedItemRef.current) {
      scrollRef.current.scrollTop =
        selectedItemRef.current.offsetTop - scrollRef.current.offsetHeight / 2;
    }
  }, []);

  useEffect(() => {
    if (anchorEl && calcMenuWidth) {
      const width = calcMenuWidth(anchorEl);
      width && setMenuWidth(width);
    }
  }, [anchorEl, calcMenuWidth]);

  const mergedClasses = useMemo(
    () => ({ paper: classes('selectable-dropdown-paper', paperClassName) }),
    [paperClassName]
  );

  const mergedButtonProps = useMemo(
    () => ({
      fullWidth: true,
      classes: { root: 'seletable-dropdown-button' },
      ...buttonProps
    }),
    [buttonProps]
  );

  const mergedPaperProps = useMemo(
    () => ({
      style: { width: menuWidth }
    }),
    [menuWidth]
  );

  return (
    <Dropdown
      label={items[selectedIndex].text}
      classes={mergedClasses}
      anchorEl={anchorEl}
      onClick={setAnchorEl}
      onClose={onClose}
      open={Boolean(anchorEl)}
      onEnter={scrollToSelectedItem}
      buttonProps={mergedButtonProps}
      PaperProps={mergedPaperProps}
      {...props}
    >
      <div className="selectable-dropdown-scroll-content" ref={scrollRef}>
        {items.map((itemProps, index) => (
          <MenuItem
            {...itemProps}
            key={index}
            innerRef={node => {
              if (index === (scrollToIndex || selectedIndex)) {
                selectedItemRef.current = node;
              }
            }}
            onClick={evt => {
              onSelect(index);
              setSelectedIndex(index);
              itemProps.onClick && itemProps.onClick(evt);
            }}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </Dropdown>
  );
}
