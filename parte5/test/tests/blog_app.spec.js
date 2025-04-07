const {test, expect, describe, beforeEach} = require('@playwright/test');
const { loginWith, createBlog } = require('./helper.js');

describe('Blog App', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/usuarios', {
      data: {
        name: 'jhon doe',
        username: 'newuser10',
        password: '1234'
      }
    })   
    
    await request.post('http://localhost:3001/api/usuarios', {
      data: {
        name: 'jane doe',
        username: 'otheruser',
        password: '1234'
      }
    })  

    await page.goto('http://localhost:5173');
  });

  test('login form is shown', async ({ page }) => {
    const locator = await page.getByRole('heading', { name: 'Login' });
    await expect(locator).toBeVisible();
  })

  describe('login', () => {

    beforeEach(async ({ page }) => {
      await loginWith(page, 'newuser10', '1234')
    })


    test('user can login with valid credentials', async ({ page }) => {
      
      await expect(page.getByText('jhon doe logged-in')).toBeVisible();
    })

    test('a new blog can be created', async ({ page }) => {
      
      await expect(page.getByText('jhon doe logged-in')).toBeVisible();

      await createBlog(page, 'My first blog', 'Jhon Doe', 'https://myfirstblog.com', "0")

      
      const newBlog = await page.getByTestId('blog-item')
      await expect(newBlog.getByTestId('blog-title')).toHaveText('My first blog');
    })
    
    test('a blog can be liked', async ({ page }) => {
      await expect(page.getByText('jhon doe logged-in')).toBeVisible();

      await createBlog(page, 'My first blog', 'Jhon Doe', 'https://myfirstblog.com', "0")

      const newBlog = await page.getByTestId('blog-item')
      await expect(newBlog.getByTestId('blog-title')).toHaveText('My first blog');

      await newBlog.getByTestId('toggle-details').click();

      await newBlog.getByRole('button', { name: 'like' }).click();
      const likesCount = await newBlog.getByText(/Likes: 1/);
      await expect(likesCount).toBeVisible();
    })

    test('a blog can be delete', async ({ page }) => {
      
      await expect(page.getByText('jhon doe logged-in')).toBeVisible();

      await createBlog(page, 'My first blog', 'Jhon Doe', 'https://myfirstblog.com', "0")

      
      const newBlog = await page.getByTestId('blog-item')
      await expect(newBlog.getByTestId('blog-title')).toHaveText('My first blog');

      await newBlog.getByTestId('toggle-details').click();

      // Interceptar y aceptar el window.confirm()
      page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept(); // Simula hacer clic en "Aceptar"
    });

      await newBlog.getByRole('button', { name: 'delete' }).click();     

      await expect(newBlog).not.toBeVisible();
    })

    test('only the creator of the blog can see the delete button', async ({ page }) => {
      await expect(page.getByText('jhon doe logged-in')).toBeVisible();

      await createBlog(page, 'My first blog', 'Jhon Doe', 'https://myfirstblog.com', "0")

      const newBlog = await page.getByTestId('blog-item')
      await expect(newBlog.getByTestId('blog-title')).toHaveText('My first blog');

      await newBlog.getByTestId('toggle-details').click();
      await expect(newBlog.getByRole('button', { name: 'delete' })).toBeVisible();

      await page.getByRole('button', { name: 'logout' }).click();

      await loginWith(page, 'otheruser', '1234')

      await expect(page.getByText('jane doe logged-in')).toBeVisible();

      const otherUserBlog = await page.getByTestId('blog-item')
      await otherUserBlog.getByTestId('toggle-details').click();

      await expect(otherUserBlog.getByRole('button', { name: 'delete' })).not.toBeVisible();
      await expect(otherUserBlog.getByText('My first blog')).toBeVisible();   

    })

    test('blogs are ordered by likes', async ({ page }) => {
      await expect(page.getByText('jhon doe logged-in')).toBeVisible();

      await createBlog(page, 'Least Liked Blog', 'Author 1', 'https://leastliked.com', "0");
      await createBlog(page, 'Medium Liked Blog', 'Author 2', 'https://mediumliked.com', "0");
      await createBlog(page, 'Most Liked Blog', 'Author 3', 'https://mostliked.com', "0");

          // Esperar a que aparezcan los 3 blogs
      const blogsLocator = page.getByTestId('blog-item');
      await expect(blogsLocator).toHaveCount(3);

      const blog0 = blogsLocator.nth(0);
      const blog1 = blogsLocator.nth(1);
      const blog2 = blogsLocator.nth(2);

      // Mostrar detalles
      await blog0.getByTestId('toggle-details').click();
      await blog1.getByTestId('toggle-details').click();
      await blog2.getByTestId('toggle-details').click();

      // Likes: blog2 (3), blog1 (2), blog0 (1)
      await blog2.getByRole('button', { name: 'like' }).click();
      await blog2.getByRole('button', { name: 'like' }).click();
      await blog2.getByRole('button', { name: 'like' }).click();

      await blog1.getByRole('button', { name: 'like' }).click();
      await blog1.getByRole('button', { name: 'like' }).click();

      await blog0.getByRole('button', { name: 'like' }).click();

      // Esperar a que los likes se actualicen
      await page.waitForTimeout(500);

      // Verificar el orden
      const blogs = [blog0, blog1, blog2];
      const likes = [];

      for (const blog of blogs) {
        const text = await blog.getByText(/Likes:/).innerText();
        const count = parseInt(text.replace('Likes:', '').trim());
        likes.push(count);
      }

      const sorted = [...likes].sort((a, b) => b - a);
      expect(likes).toEqual(sorted);
    })
    

  })

  test('login fails with wrong credentials', async ({ page }) => {
    await loginWith(page, 'wronguser', 'wrongpassword')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')

    //podemos probar estilos de css
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    
    await expect(page.getByText('jhon doe logged-in')).not.toBeVisible()
  })

})