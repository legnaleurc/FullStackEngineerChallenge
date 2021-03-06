import { CSSProperties } from '@material-ui/core/styles/withStyles';


export const FONT_FAMILY = [
  'Roboto',
  'Hiragino Kaku Gothic Pro',
  'Meiryo',
  'Noto Sans CJK JP',
  'sans-serif',
].map((s) => `"${s}"`).join(', ');


type MixinName = (
  | 'hbox'
  | 'vbox'
  | 'size-grow'
  | 'size-shrink'
  | 'w-100'
  | 'w-50'
  | 'h-100'
  | 'mh-0'
  | 'scrollable'
  | 'no-scroll'
  | 'y-scroll'
  | 'center'
);


// predefined CSS set
export function getMixins (nameList: MixinName[]) {
  const rv: CSSProperties = {};
  for (const name of nameList) {
    switch (name) {
      case 'hbox':
        rv.display = 'flex';
        break;
      case 'vbox':
        rv.display = 'flex';
        rv.flexDirection = 'column';
        break;
      case 'size-grow':
        rv.flex = 'auto';
        break;
      case 'size-shrink':
        rv.flex = '0 0 auto';
        break;
      case 'w-100':
        rv.width = '100%';
        break;
      case 'h-100':
        rv.height = '100%';
        break;
      case 'w-50':
        rv.width = '50%';
        break;
      case 'mh-0':
        rv.minHeight = 0;
        break;
      case 'scrollable':
        rv.overflow = 'scroll';
        break;
      case 'no-scroll':
        rv.overflow = 'hidden';
        break;
      case 'y-scroll':
        rv.overflowY = 'scroll';
        break;
      case 'center':
        rv.justifyContent = 'center';
        rv.alignItems = 'center';
      default:
        break;
    }
  }
  return rv;
}
