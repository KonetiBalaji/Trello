# Installation Troubleshooting Guide

## Common Issues and Solutions

### 1. Deprecated Package Warnings

**Issue**: Warnings about deprecated packages like `rollup-plugin-terser`, `eslint@8.57.1`, etc.

**Solution**: These are warnings from dependencies, not errors. The application will still work. These are being addressed by updating dependencies, but some warnings may persist until the dependency maintainers update their packages.

### 2. EBUSY: Resource Busy or Locked Errors

**Issue**: 
```
npm warn cleanup Failed to remove some directories
[Error: EBUSY: resource busy or locked, rmdir ...]
```

**Cause**: Windows file locking - some files are still in use by another process.

**Solutions**:

1. **Close all processes using the files**:
   - Close VS Code/Cursor if it's open
   - Close any terminal windows
   - Close any running Node.js processes
   - Close file explorer windows showing the node_modules folder

2. **Delete node_modules manually**:
   ```powershell
   # In PowerShell, navigate to frontend directory
   cd trello-app-frontend
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   npm install
   ```

3. **Use npm cache clean**:
   ```powershell
   npm cache clean --force
   npm install
   ```

4. **If still having issues, restart your computer** and try again.

**Note**: These warnings are usually harmless and don't prevent the application from working. The installation typically completes successfully despite these warnings.

### 3. Security Vulnerabilities

**Issue**: `2 moderate severity vulnerabilities` in webpack-dev-server

**Solution**: The package.json has been updated with an override to use a newer, secure version of webpack-dev-server. After updating, run:

```powershell
npm install
npm audit fix
```

If vulnerabilities persist:
```powershell
npm audit fix --force
```

**Warning**: `--force` may introduce breaking changes. Test your application after using it.

### 4. Installation Takes Too Long

**Issue**: npm install is slow or hangs

**Solutions**:

1. **Clear npm cache**:
   ```powershell
   npm cache clean --force
   ```

2. **Use a different registry** (if network issues):
   ```powershell
   npm config set registry https://registry.npmjs.org/
   ```

3. **Delete package-lock.json and node_modules, then reinstall**:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   npm install
   ```

### 5. Permission Errors

**Issue**: EACCES or permission denied errors

**Solution**: Run PowerShell/Command Prompt as Administrator, or fix npm permissions:

```powershell
# Fix npm permissions (Windows)
npm config set prefix %APPDATA%\npm
```

### 6. Node Version Issues

**Issue**: Errors about Node.js version

**Solution**: Ensure you're using Node.js 16.x or higher:

```powershell
node --version
```

If you need to update Node.js, download from https://nodejs.org/

### 7. React Scripts Issues

**Issue**: Errors related to react-scripts

**Solution**: 
```powershell
# Remove and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

## Clean Installation Steps

If you're experiencing multiple issues, perform a clean installation:

```powershell
# 1. Navigate to frontend directory
cd trello-app-frontend

# 2. Remove existing installation
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# 3. Clear npm cache
npm cache clean --force

# 4. Fresh install
npm install

# 5. Fix any remaining vulnerabilities
npm audit fix
```

## Verification

After installation, verify everything works:

```powershell
# Check if installation was successful
npm list --depth=0

# Try starting the app
npm start
```

If `npm start` works, the installation was successful despite any warnings.

## Still Having Issues?

1. Check Node.js version: `node --version` (should be 16+)
2. Check npm version: `npm --version` (should be 8+)
3. Try installing with verbose output: `npm install --verbose`
4. Check for antivirus software blocking npm
5. Try installing in a different directory to rule out path issues

