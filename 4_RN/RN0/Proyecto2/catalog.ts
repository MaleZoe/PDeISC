export type ComponentId =
  | 'view'
  | 'text'
  | 'image'
  | 'scrollview'
  | 'flatlist'
  | 'textinput'
  | 'button'
  | 'touchable'
  | 'switch'
  | 'checkbox'
  | 'activity'
  | 'modal';

export type CatalogItem = {
  id: ComponentId;
  name: string;
  description: string;
  useFor: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  code: string;
};

export const CATALOG: CatalogItem[] = [
  {
    id: 'text',
    name: 'Text',
    description: 'Se utiliza para mostrar texto en la app, con estilos y tipografía personalizada.',
    useFor: 'Mostrar información textual.',
    icon: 'T',
    iconBg: '#F3E8FF',
    iconColor: '#7C3AED',
    code: `<Text style={styles.text}>
  Texto de ejemplo
</Text>`,
  },
  {
    id: 'view',
    name: 'View',
    description: 'Es un contenedor genérico que se usa para agrupar otros componentes y aplicar estilos.',
    useFor: 'Organizar y estructurar la interfaz.',
    icon: '▢',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    code: `<View style={styles.container}>
  <Text>Contenedor
  con estilos</Text>
</View>`,
  },
  {
    id: 'image',
    name: 'Image',
    description: 'Permite mostrar imágenes desde el dispositivo o desde una URL.',
    useFor: 'Mostrar imágenes en la interfaz.',
    icon: '▭',
    iconBg: '#CFFAFE',
    iconColor: '#0891B2',
    code: `<Image
  source={{ uri: 'https://...' }}
  style={styles.image}
/>`,
  },
  {
    id: 'button',
    name: 'Button',
    description: 'Se usa para crear botones interactivos en la app.',
    useFor: 'Accionar funciones y eventos.',
    icon: '▶',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    code: `<Button
  title="Presionar"
  onPress={handlePress}
/>`,
  },
  {
    id: 'textinput',
    name: 'TextInput',
    description: 'Permite al usuario ingresar texto desde el teclado.',
    useFor: 'Capturar datos del usuario.',
    icon: '⌨️',
    iconBg: '#FFEDD5',
    iconColor: '#EA580C',
    code: `<TextInput
  placeholder="Escribí algo..."
  style={styles.input}
/>`,
  },
  {
    id: 'scrollview',
    name: 'ScrollView',
    description: 'Permite hacer scroll en un contenedor con varios elementos.',
    useFor: 'Mostrar contenido extenso.',
    icon: '☰',
    iconBg: '#DBEAFE',
    iconColor: '#2563EB',
    code: `<ScrollView style={styles.scroll}>
  {/* contenido */}
</ScrollView>`,
  },
  {
    id: 'flatlist',
    name: 'FlatList',
    description: 'Renderiza listas de forma eficiente, ideal para grandes cantidades de datos.',
    useFor: 'Mostrar listas dinámicas y eficientes.',
    icon: '☰',
    iconBg: '#CCFBF1',
    iconColor: '#0F766E',
    code: `<FlatList
  data={data}
  renderItem={({ item }) =>
    <Text>{item.name}</Text>}
/>`,
  },
  {
    id: 'touchable',
    name: 'TouchableOpacity',
    description: 'Hace que un elemento sea interactivo al tocarlo.',
    useFor: 'Crear botones personalizados y áreas táctiles.',
    icon: '◎',
    iconBg: '#E2E8F0',
    iconColor: '#334155',
    code: `<TouchableOpacity
  onPress={handlePress}
  style={styles.touchable}
>
  <Text>Toqué aquí</Text>
</TouchableOpacity>`,
  },
  {
    id: 'switch',
    name: 'Switch',
    description: 'Permite al usuario activar o desactivar una opción.',
    useFor: 'Opciones de configuración y estado.',
    icon: '◐',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    code: `<Switch
  value={isOn}
  onValueChange={setIsOn}
/>`,
  },
  {
    id: 'checkbox',
    name: 'CheckBox',
    description: 'Permite seleccionar una o más opciones de una lista.',
    useFor: 'Seleccionar opciones múltiples.',
    icon: '☑',
    iconBg: '#DCFCE7',
    iconColor: '#15803D',
    code: `<CheckBox
  value={isChecked}
  onValueChange={setChecked}
/>`,
  },
  {
    id: 'activity',
    name: 'ActivityIndicator',
    description: 'Muestra un indicador de carga mientras se realiza una acción.',
    useFor: 'Indicar que algo está cargando.',
    icon: '◌',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    code: `<ActivityIndicator
  size="large"
  color="#2563EB"
/>`,
  },
  {
    id: 'modal',
    name: 'Modal',
    description: 'Muestra contenido en una ventana emergente sobre la pantalla.',
    useFor: 'Mostrar información o pedir acciones sin salir de la pantalla actual.',
    icon: '▢',
    iconBg: '#EDE9FE',
    iconColor: '#6D28D9',
    code: `<Modal visible={visible} transparent>
  <View style={styles.modal}>
    <Text>Contenido del modal</Text>
  </View>
</Modal>`,
  },
];

export const LANDSCAPE =
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80';

export const THUMBS = [
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80',
];

export const LIST_DATA = [
  { id: '1', name: 'React Native' },
  { id: '2', name: 'TypeScript' },
  { id: '3', name: 'Expo' },
  { id: '4', name: 'Flexbox' },
  { id: '5', name: 'JavaScript' },
  { id: '6', name: 'React Navigation' },
  { id: '7', name: 'Redux' },
  { id: '8', name: 'Zustand' },
  { id: '9', name: 'Reanimated' },
  { id: '10', name: 'Gesture Handler' },
  { id: '11', name: 'Hermes' },
  { id: '12', name: 'Metro Bundler' },
];
