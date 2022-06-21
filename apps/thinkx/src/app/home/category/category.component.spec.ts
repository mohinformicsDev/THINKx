describe('CategoryComponent', () => {
  it('check login else login', () => {
    cy.visit('localhost:4200/');
    cy.get('input[type="email"]').clear();
    cy.get('input[type="password"]').clear();
    cy.get('input[type="email"]').type('abc@gmail.com');
    cy.get('input[type="password"]').type('temp');
    cy.contains('Login').click();
    cy.contains('Login Successfully');
    cy.contains('close').click();
    cy.url().should('include', 'localhost:4200/home/dashboard');
    cy.visit('http://localhost:4200/home/category');
  });

  it('check category active with url to', () => {
    cy.url().should('include', 'http://localhost:4200/home/category');
    cy.get('a[href="/home/category"]').should('have.class', 'active');
  });

  it('add new category', () => {
    cy.url().should('include', 'http://localhost:4200/home/category');
    cy.get('mat-icon').contains('add').click();
    cy.get('thinkx-add-category-form').should('be.visible');

    cy.get('thinkx-add-category-form')
      .find('input[placeholder="Enter Text"]')
      .type('testing category');

    cy.get('thinkx-add-category-form')
      .find('input')
      .last()
      .type(
        'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
      );

    cy.get('mat-dialog-actions').find('button').first().click();
    cy.contains('New data is added');
    cy.contains('testing category');
  });

  it('delete new added cateogry', () => {
    cy.url().should('include', 'http://localhost:4200/home/category');
    cy.contains('testing category')
      .parent()
      .find('mat-icon')
      .contains('keyboard_arrow_down')
      .click();
    cy.get('.mat-column-expandedDetail')
      .eq(1)
      .find('mat-icon')
      .contains('delete')
      .click();
    cy.get('thinkx-delete-confirm-dialog').should('be.visible');
    cy.get('thinkx-delete-confirm-dialog').find('button').eq(1).click();
    cy.contains('Data is deleted');
    cy.contains('testing category').should('not.exist');
  });
});
