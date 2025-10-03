# Fixing IntelliJ IDEA Memory Issues

## Issue Description
You're experiencing an "Abnormal build process termination" due to insufficient memory for the Java Runtime Environment. This is indicated by:
- `There is insufficient memory for the Java Runtime Environment to continue`
- `The paging file is too small for this operation to complete`
- `Native memory allocation (mmap) failed to map 197132288 bytes`

## Solutions (Try in order)

### Solution 1: Increase IntelliJ IDEA Memory Settings

1. **Close IntelliJ IDEA completely**

2. **Edit IntelliJ IDEA VM Options:**
   - Go to: `Help` → `Edit Custom VM Options...`
   - If the file doesn't exist, IntelliJ will create it for you
   - Add/modify these settings:

```
-Xms2048m
-Xmx4096m
-XX:ReservedCodeCacheSize=1024m
-XX:InitialCodeCacheSize=64m
-XX:+UseConcMarkSweepGC
-XX:SoftRefLRUPolicyMSPerMB=50
-ea
-XX:CICompilerCount=2
-Dsun.io.useCanonPrefixCache=false
-Djdk.http.auth.tunneling.disabledSchemes=""
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow
-Djb.vmOptionsFile=C:\Users\USER\AppData\Roaming\JetBrains\IdeaIC2024.3\idea64.exe.vmoptions
-Djava.system.class.loader=com.intellij.util.lang.PathClassLoader
-Xverify:none
```

3. **Restart IntelliJ IDEA**

### Solution 2: Increase Windows Virtual Memory (Paging File)

1. **Open System Properties:**
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Or: Right-click "This PC" → Properties → Advanced System Settings

2. **Configure Virtual Memory:**
   - Click "Advanced" tab
   - Click "Settings..." under Performance
   - Click "Advanced" tab in Performance Options
   - Click "Change..." under Virtual Memory

3. **Set Custom Size:**
   - Uncheck "Automatically manage paging file size for all drives"
   - Select your system drive (usually C:)
   - Choose "Custom size"
   - Set Initial size: `4096` MB
   - Set Maximum size: `8192` MB (or higher if you have space)
   - Click "Set" then "OK"

4. **Restart your computer**

### Solution 3: Configure IntelliJ Build Process Memory

1. **Open IntelliJ IDEA Settings:**
   - Press `Ctrl + Alt + S` or go to `File` → `Settings`

2. **Navigate to Build Settings:**
   - Go to `Build, Execution, Deployment` → `Compiler`

3. **Increase Build Process Heap Size:**
   - Set "Build process heap size (Mbytes)": `2048` (or higher)

4. **Configure Additional Build Options:**
   - Go to `Build, Execution, Deployment` → `Compiler` → `Java Compiler`
   - In "Additional command line parameters" add:
   ```
   -J-Xmx2048m -J-XX:MaxPermSize=512m
   ```

### Solution 4: Optimize Project Build Configuration

1. **Disable Unnecessary Plugins:**
   - Go to `File` → `Settings` → `Plugins`
   - Disable plugins you don't need

2. **Configure Gradle/Maven Memory (if applicable):**
   
   For Gradle projects, create/edit `gradle.properties`:
   ```properties
   org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
   org.gradle.parallel=true
   org.gradle.configureondemand=true
   org.gradle.daemon=true
   ```

### Solution 5: Alternative Build Methods

If IntelliJ continues to have issues, you can build the project using command line:

1. **For Maven projects:**
   ```bash
   cd backend
   mvn clean compile
   mvn clean package
   ```

2. **For Gradle projects:**
   ```bash
   cd backend
   ./gradlew clean build
   ```

## Quick Temporary Fix

If you need an immediate solution:

1. **Close all unnecessary applications**
2. **Restart IntelliJ IDEA**
3. **Build only the specific module you need:**
   - Right-click on the module → "Rebuild Module"
4. **Use "Build Project" instead of "Rebuild Project"**

## Verification Steps

After applying solutions:

1. Open IntelliJ IDEA
2. Try building the project again
3. Monitor memory usage in Task Manager
4. Check if the error persists

## Additional Recommendations

1. **Close unnecessary browser tabs and applications**
2. **Consider upgrading system RAM if frequently encountering memory issues**
3. **Use IntelliJ's "Power Save Mode" when not actively developing**
4. **Regularly clean IntelliJ caches: `File` → `Invalidate Caches and Restart`**

## If Issues Persist

Contact me with:
- Your system specifications (RAM, OS version)
- IntelliJ IDEA version
- Project size and type
- Current VM options settings
