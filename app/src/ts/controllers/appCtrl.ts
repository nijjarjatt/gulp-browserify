export interface IAppCtrl {
	message: string;
};

export class AppCtrl implements IAppCtrl{	
	message: string;

	static $inject: any[] = [];

	constructor(){
		this.message = 'Message';
	}
}