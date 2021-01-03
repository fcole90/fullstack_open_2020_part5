
Cypress.Commands.add('newBlog', ({ blog, token }) => {
  return cy.request({
    method: 'POST',
    url: 'http://localhost:3001/api/blogs',
    body: blog,
    headers: { Authorization: `bearer ${token}` }
  })
})

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request(
    'POST',
    'http://localhost:3001/api/login',
    { username, password }
  )
    .then(response => {
      localStorage.setItem('loggedBlogUser', JSON.stringify(response.body))
      return response
    })
})



describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users/', {
      username: 'tester',
      name: 'cypress-tester',
      password: 'pass'
    })
    cy.visit('http://localhost:3000')
  })

  // it('Login form is shown', function() {
  //   cy.get('#login-form')
  // })

  // describe('Login',function() {
  //   it('succeeds with correct credentials', function() {
  //     cy.get('#login-form').get('.username')
  //       .type('tester')
  //     cy.get('#login-form').get('.password')
  //       .type('pass')
  //     cy.get('#login-form').get('.submit')
  //       .click()
  //       .should('not.exist')
  //   })

  //   it('fails with wrong credentials', function() {
  //     cy.get('#login-form').get('.username')
  //       .type('tester')
  //     cy.get('#login-form').get('.password')
  //       .type('wrong')
  //     cy.get('#login-form').get('.submit')
  //       .click()
  //     cy.contains('Could not login')
  //     cy.get('#notification').should('have.css', 'color', 'rgb(255, 0, 0)')
  //   })
  // })


  describe.only('When logged in', function() {
    beforeEach(function() {
      return cy.login({
        username: 'tester',
        password: 'pass'
      })
        .then((response) => {

          const token = response.body.token

          cy.newBlog({ token,
            blog: {
              title: 'mock title',
              author: 'mock author',
              url: 'mock url'
            }
          })

          cy.newBlog({ token,
            blog: {
              title: 'most liked',
              author: 'mock author',
              url: 'mock url',
              likes: 99999
            }
          })

          cy.newBlog({ token,
            blog: {
              title: 'quite liked',
              author: 'mock author',
              url: 'mock url',
              likes: 100
            }
          })

          cy.newBlog({ token,
            blog: {
              title: 'little liked',
              author: 'mock author',
              url: 'mock url',
              likes: 10
            }
          })

          cy.visit('http://localhost:3000/')
        })
    })

    it('A blog can be created', function() {
      // Toogle form
      cy.get('#toogle-blog-add-form')
        .get('.toogle-button')
        .click()

      // Fill and submit
      cy.get('#blog-add-form__title')
        .type('new blog name')
      cy.get('#blog-add-form__author')
        .type('new blog author')
      cy.get('#blog-add-form__url')
        .type('new blog url')
      cy.get('#blog-add-form__submit')
        .click()

      // Check blog appears
      cy.get('#blog-list')
        .contains('new blog name')
    })


    it('A blog can be liked', function() {
      // Expand the first blog
      cy.get('#blog-list')
        .contains('mock title')
        .find('.view-button')
        .click()
      //Check likes to be zero
      cy.get('#blog-list')
        .contains('mock title')
        .contains('Likes:0')
      // Like the first blog
      cy.get('#blog-list')
        .contains('mock title')
        .find('.view-button')
        .get('.like-button')
        .click()
      //Check likes to be one
      cy.get('#blog-list')
        .contains('mock title')
        .contains('Likes:1')
    })

    it('If I own a blog, I can delete it', function() {
      // Expand the first blog
      cy.get('#blog-list')
        .contains('mock title')
        .find('.view-button')
        .click()
      // Delete the first blog
      cy.get('#blog-list')
        .contains('mock title')
        .find('.delete-button')
        .click()
      // The blog doesn't exist anymore
      cy.get('#blog-list')
        .contains('mock title')
        .should('not.exist')
    })


    it('Blogs are sorted by likes', function() {

      cy.get('#blog-list .view-button')
        .each(($el) => {
          cy.wrap($el).click()
        })

      cy.get('#blog-list .likes-amount')
        .then((list) => {
          console.log(list)
          console.log(Cypress.$(list).text())
          list.map((i, el) => {
            console.log('el:', el, 'i:', i)
            console.log(Cypress.$(i).text(), Cypress.$(el).text())
          })
        })

      cy.get('#blog-list .likes-amount')
        .then(($likes_amount) => {
          const likes_amount_values = $likes_amount.map((i, el) => {
            return Cypress.$(el).text()
          }).get()

          for (let i = 1; i < likes_amount_values.length; i++) {
            expect(Number(likes_amount_values[i-1])).to.be.gt(Number(likes_amount_values[i]))
          }
        })
    })
  })
})