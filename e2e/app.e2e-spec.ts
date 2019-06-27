import { IdsrAppPage } from './app.po';

describe('idsr-app App', () => {
  let page: IdsrAppPage;

  beforeEach(() => {
    page = new IdsrAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
