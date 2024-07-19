export default interface IStorageProvider {
	getItem: (key: string) => string | undefined;
	setItem: (key: string, value: string) => void;
	getStore: () => object;
}
